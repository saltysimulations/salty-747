import { FlightPathUtils, LegDefinition } from '../flightplan';
import { GeoCircle, GeoPoint, GeoPointReadOnly } from '../geo';
import { UnitType } from '../math';
import { AirportFacility, AirportRunway, Facility, FacilityType, ICAO } from './Facilities';

/**
 * A collection of unique string waypoint type keys.
 */
export enum WaypointTypes {
  Custom = 'Custom',
  Airport = 'Airport',
  NDB = 'NDB',
  VOR = 'VOR',
  Intersection = 'Intersection',
  Runway = 'Runway',
  User = 'User',
  Visual = 'Visual',
  FlightPlan = 'FlightPlan',
  VNAV = 'VNAV'
}

/**
 * A navigational waypoint.
 */
export interface Waypoint {
  /** The geographic location of the waypoint. */
  readonly location: GeoPointReadOnly;

  /** A unique string ID assigned to this waypoint. */
  readonly uid: string;

  /**
   * Checks whether this waypoint and another are equal.
   * @param other The other waypoint.
   * @returns whether this waypoint and the other are equal.
   */
  equals(other: Waypoint): boolean;

  /** The unique string type of this waypoint. */
  readonly type: string;
}

/**
 * An abstract implementation of Waypoint.
 */
export abstract class AbstractWaypoint implements Waypoint {
  public abstract get location(): GeoPointReadOnly;
  public abstract get uid(): string;
  public abstract get type(): string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public equals(other: Waypoint): boolean {
    return this.uid === other.uid;
  }
}

/**
 * A waypoint with custom defined lat/lon coordinates.
 */
export class CustomWaypoint extends AbstractWaypoint {
  private readonly _location: GeoPoint;
  private readonly _uid: string;

  /**
   * Constructor.
   * @param lat The latitude of this waypoint.
   * @param lon The longitude of this waypoint.
   * @param uidPrefix The prefix of this waypoint's UID.
   */
  constructor(lat: number, lon: number, uidPrefix: string) {
    super();

    this._location = new GeoPoint(lat, lon);
    this._uid = `${uidPrefix}[${this.location.lat},${this.location.lon}]`;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public get location(): GeoPointReadOnly {
    return this._location.readonly;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public get uid(): string {
    return this._uid;
  }

  /** @inheritdoc */
  public get type(): string {
    return WaypointTypes.Custom;
  }
}

/**
 * A waypoint associated with a facility.
 */
export class FacilityWaypoint<T extends Facility = Facility> extends AbstractWaypoint {
  private readonly _location: GeoPoint;
  private readonly _type: string;

  /**
   * Constructor.
   * @param facility The facility associated with this waypoint.
   */
  constructor(public readonly facility: T) {
    super();

    this._location = new GeoPoint(facility.lat, facility.lon);
    this._type = ICAO.getFacilityType(facility.icao);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public get location(): GeoPointReadOnly {
    return this._location.readonly;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public get uid(): string {
    return this.facility.icao;
  }

  /** @inheritdoc */
  public get type(): string {
    switch (this._type) {
      case FacilityType.Airport:
        return WaypointTypes.Airport;
      case FacilityType.Intersection:
        return WaypointTypes.Intersection;
      case FacilityType.NDB:
        return WaypointTypes.NDB;
      case FacilityType.RWY:
        return WaypointTypes.Runway;
      case FacilityType.USR:
        return WaypointTypes.User;
      case FacilityType.VIS:
        return WaypointTypes.Visual;
      case FacilityType.VOR:
        return WaypointTypes.VOR;
      default:
        return WaypointTypes.User;
    }
  }
}

/**
 * Airport size.
 */
export enum AirportSize {
  Large = 'Large',
  Medium = 'Medium',
  Small = 'Small'
}

/**
 * A waypoint associated with an airport.
 */
export class AirportWaypoint<T extends AirportFacility = AirportFacility> extends FacilityWaypoint<T> {
  /** The longest runway at the airport associated with this waypoint, or null if the airport has no runways. */
  public readonly longestRunway: AirportRunway | null;

  /** The size of the airport associated with this waypoint. */
  public readonly size: AirportSize;

  /**
   * Constructor.
   * @param airport The airport associated with this waypoint.
   */
  constructor(airport: T) {
    super(airport);

    this.longestRunway = AirportWaypoint.getLongestRunway(airport);
    this.size = AirportWaypoint.getAirportSize(airport, this.longestRunway);
  }

  /**
   * Gets the longest runway at an airport.
   * @param airport An airport.
   * @returns the longest runway at an airport, or null if the airport has no runways.
   */
  private static getLongestRunway(airport: AirportFacility): AirportRunway | null {
    if (airport.runways.length === 0) {
      return null;
    }

    return airport.runways.reduce((a, b) => a.length > b.length ? a : b);
  }

  /**
   * Gets the size of an airport.
   * @param airport An airport.
   * @param longestRunway The longest runway at the airport.
   * @returns the size of the airport.
   */
  private static getAirportSize(airport: AirportFacility, longestRunway: AirportRunway | null): AirportSize {
    if (!longestRunway) {
      return AirportSize.Small;
    }

    const longestRwyLengthFeet = UnitType.METER.convertTo(longestRunway.length, UnitType.FOOT) as number;
    return longestRwyLengthFeet >= 8100 ? AirportSize.Large
      : (longestRwyLengthFeet >= 5000 || airport.towered) ? AirportSize.Medium
        : AirportSize.Small;
  }
}

/**
 * A flight path waypoint.
 */
export class FlightPathWaypoint extends CustomWaypoint {
  public static readonly UID_PREFIX = 'FLPTH';

  /** @inheritdoc */
  public get type(): string { return WaypointTypes.FlightPlan; }

  /**
   * Constructor.
   * @param lat The latitude of this waypoint.
   * @param lon The longitude of this waypoint.
   * @param ident The ident string of this waypoint.
   */
  constructor(lat: number, lon: number, public readonly ident: string) {
    super(lat, lon, `${FlightPathWaypoint.UID_PREFIX}_${ident}`);
  }
}

/**
 * A VNAV TOD/BOD waypoint.
 */
export class VNavWaypoint extends AbstractWaypoint {
  private static readonly uidMap = { 'tod': 'vnav-tod', 'bod': 'vnav-bod' };
  private static readonly vec3Cache = [new Float64Array(3), new Float64Array(3)];
  private static readonly geoPointCache = [new GeoPoint(0, 0)];
  private static readonly geoCircleCache = [new GeoCircle(new Float64Array(3), 0)];

  private readonly _location: GeoPoint;
  private readonly _uid: string;

  /** @inheritdoc */
  public get type(): string { return WaypointTypes.VNAV; }

  /**
   * Constructor.
   * @param leg The leg that the VNAV waypoint is contained in.
   * @param distanceFromEnd The distance along the flight path from the end of the leg to the location of the waypoint,
   * in meters.
   * @param type The type of VNAV leg.
   */
  constructor(leg: LegDefinition, distanceFromEnd: number, type: 'tod' | 'bod') {
    super();

    this._uid = VNavWaypoint.uidMap[type];
    this._location = this.getWaypointLocation(leg, distanceFromEnd);
  }

  /**
   * Gets the waypoint's location in space.
   * @param leg The leg that the waypoint resides in.
   * @param distanceFromEnd The distance along the flight path from the end of the leg to the location of the waypoint,
   * in meters.
   * @returns The waypoint's location.
   */
  private getWaypointLocation(leg: LegDefinition, distanceFromEnd: number): GeoPoint {
    const out = new GeoPoint(0, 0);

    if (leg.calculated !== undefined) {
      const vectors = [...leg.calculated.ingress, ...leg.calculated.ingressToEgress, ...leg.calculated.egress];
      let vectorIndex = vectors.length - 1;

      while (vectorIndex >= 0) {
        const vector = vectors[vectorIndex];

        const start = VNavWaypoint.vec3Cache[0];
        const end = VNavWaypoint.vec3Cache[1];

        GeoPoint.sphericalToCartesian(vector.endLat, vector.endLon, end);
        GeoPoint.sphericalToCartesian(vector.startLat, vector.startLon, start);

        const circle = FlightPathUtils.setGeoCircleFromVector(vector, VNavWaypoint.geoCircleCache[0]);
        const vectorDistance = UnitType.GA_RADIAN.convertTo(circle.distanceAlong(start, end), UnitType.METER);

        if (vectorDistance >= distanceFromEnd) {
          return circle.offsetDistanceAlong(end, UnitType.METER.convertTo(-distanceFromEnd, UnitType.GA_RADIAN), out);
        } else {
          distanceFromEnd -= vectorDistance;
        }

        vectorIndex--;
      }

      if (vectors.length > 0) {
        out.set(vectors[0].startLat, vectors[0].startLon);
      }
    }

    return out;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public get location(): GeoPointReadOnly {
    return this._location.readonly;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public get uid(): string {
    return this._uid;
  }
}