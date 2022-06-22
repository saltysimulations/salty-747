import { GeoCircle, GeoPoint, LatLonInterface, MathUtils, ReadonlyFloat64Array, UnitType, Vec3Math } from '..';
import { CircleVector, FlightPathVector, FlightPathVectorFlags, LegCalculations, VectorTurnDirection } from './FlightPlanning';

/**
 * Utility class for working with flight path calculations.
 */
export class FlightPathUtils {
  private static readonly vec3Cache = [new Float64Array(3)];
  private static readonly geoPointCache = [new GeoPoint(0, 0), new GeoPoint(0, 0)];
  private static readonly geoCircleCache = [new GeoCircle(new Float64Array(3), 0)];

  /**
   * Creates an empty arc vector.
   * @returns An empty arc vector.
   */
  public static createEmptyCircleVector(): CircleVector {
    return {
      vectorType: 'circle',
      flags: FlightPathVectorFlags.None,
      radius: 0,
      centerX: 1,
      centerY: 0,
      centerZ: 0,
      startLat: 0,
      startLon: 0,
      endLat: 0,
      endLon: 0,
      distance: 0
    };
  }

  /**
   * Sets the parameters of a circle vector.
   * @param vector The circle vector to set.
   * @param circle The GeoCircle defining the vector's path.
   * @param start The start of the vector.
   * @param end The end of the vector.
   * @param flags The flags to set on the vector.
   * @returns The circle vector, after its parameters have been set.
   */
  public static setCircleVector(
    vector: CircleVector,
    circle: GeoCircle,
    start: ReadonlyFloat64Array | LatLonInterface,
    end: ReadonlyFloat64Array | LatLonInterface,
    flags: number
  ): CircleVector {
    vector.flags = flags;

    vector.radius = circle.radius;
    vector.centerX = circle.center[0];
    vector.centerY = circle.center[1];
    vector.centerZ = circle.center[2];
    vector.distance = UnitType.GA_RADIAN.convertTo(circle.distanceAlong(start, end, Math.PI), UnitType.METER);

    start instanceof Float64Array && (start = FlightPathUtils.geoPointCache[0].setFromCartesian(start));
    end instanceof Float64Array && (end = FlightPathUtils.geoPointCache[1].setFromCartesian(end));

    vector.startLat = (start as LatLonInterface).lat;
    vector.startLon = (start as LatLonInterface).lon;
    vector.endLat = (end as LatLonInterface).lat;
    vector.endLon = (end as LatLonInterface).lon;

    return vector;
  }

  /**
   * Checks whether a circle vector describes a great-circle path.
   * @param vector A flight path circle vector.
   * @returns Whether the vector describes a great-circle path.
   */
  public static isVectorGreatCircle(vector: CircleVector): boolean {
    return vector.radius === Math.PI / 2;
  }

  /**
   * Sets the parameters of a GeoCircle from a flight path circle vector.
   * @param vector A flight path circle vector.
   * @param out The GeoCircle to set.
   * @returns The GeoCircle, after its parameters have been set.
   */
  public static setGeoCircleFromVector(vector: CircleVector, out: GeoCircle): GeoCircle {
    return out.set(Vec3Math.set(vector.centerX, vector.centerY, vector.centerZ, FlightPathUtils.vec3Cache[0]), vector.radius);
  }

  /**
   * Gets the initial true course bearing of a flight path vector.
   * @param vector A flight path vector.
   * @returns The initial true course bearing of the vector, or undefined if one could not be calculated.
   */
  public static getVectorInitialCourse(vector: FlightPathVector): number {
    return FlightPathUtils.setGeoCircleFromVector(
      vector,
      FlightPathUtils.geoCircleCache[0]
    ).bearingAt(FlightPathUtils.geoPointCache[0].set(vector.startLat, vector.startLon), Math.PI);
  }

  /**
   * Gets the final true course bearing of a flight path vector.
   * @param vector A flight path vector.
   * @returns The final true course bearing of the vector, or `undefined` if one could not be calculated.
   */
  public static getVectorFinalCourse(vector: FlightPathVector): number {
    return FlightPathUtils.setGeoCircleFromVector(
      vector,
      FlightPathUtils.geoCircleCache[0]
    ).bearingAt(FlightPathUtils.geoPointCache[0].set(vector.endLat, vector.endLon), Math.PI);
  }

  /**
   * Gets the final position of a calculated leg.
   * @param legCalc A set of leg calculations.
   * @param out The GeoPoint object to which to write the result.
   * @returns The final position of the leg, or `undefined` if one could not be obtained.
   */
  public static getLegFinalPosition(legCalc: LegCalculations, out: GeoPoint): GeoPoint | undefined {
    if (legCalc.endLat !== undefined && legCalc.endLon !== undefined) {
      return out.set(legCalc.endLat, legCalc.endLon);
    }

    return undefined;
  }

  /**
   * Gets the final true course of a calculated leg.
   * @param legCalc A set of leg calculations.
   * @returns The final true course of the leg, or `undefined` if one could not be obtained.
   */
  public static getLegFinalCourse(legCalc: LegCalculations): number | undefined {
    if (legCalc.flightPath.length > 0) {
      const vector = legCalc.flightPath[legCalc.flightPath.length - 1];
      return this.getVectorFinalCourse(vector);
    }

    return undefined;
  }

  /**
   * Gets the circle describing the path of a turn.
   * @param center The center of the turn.
   * @param radius The radius of the turn, in great-arc radians.
   * @param turnDirection The direction of the turn.
   * @param out A GeoCircle object to which to write the result.
   * @returns The circle describing the path of the turn.
   */
  public static getTurnCircle(center: ReadonlyFloat64Array | LatLonInterface, radius: number, turnDirection: VectorTurnDirection, out: GeoCircle): GeoCircle {
    out.set(center, radius);
    if (turnDirection === 'right') {
      out.reverse();
    }
    return out;
  }

  /**
   * Reverses the direction of a turn circle while keeping the turn center and turn radius constant.
   * @param circle The turn circle to reverse.
   * @param out A GeoCircle object to which to write the result.
   * @returns A turn circle which has the same turn center and turn radius, but the opposite direction as `circle`.
   */
  public static reverseTurnCircle(circle: GeoCircle, out: GeoCircle): GeoCircle {
    return out.set(Vec3Math.multScalar(circle.center, -1, FlightPathUtils.vec3Cache[0]), Math.PI - circle.radius);
  }

  /**
   * Gets the direction of a turn described by a circle.
   * @param circle The geo circle describing the turn.
   * @returns The direction of the turn described by the circle.
   */
  public static getTurnDirectionFromCircle(circle: GeoCircle): VectorTurnDirection {
    return circle.radius > MathUtils.HALF_PI ? 'right' : 'left';
  }

  /**
   * Gets the radius of a turn described by a circle.
   * @param circle The geo circle describing the turn.
   * @returns The radius of the turn described by the circle, in great-arc radians.
   */
  public static getTurnRadiusFromCircle(circle: GeoCircle): number {
    return Math.min(circle.radius, Math.PI - circle.radius);
  }

  /**
   * Gets the center of a turn described by a circle.
   * @param circle The geo circle describing the turn.
   * @param out A GeoPoint or 3D vector object to which to write the result.
   * @returns The center of a turn described by the circle.
   */
  public static getTurnCenterFromCircle<T extends GeoPoint | Float64Array>(circle: GeoCircle, out: T): T {
    return (
      circle.radius > MathUtils.HALF_PI
        ? out instanceof Float64Array
          ? Vec3Math.multScalar(circle.center, -1, out)
          : out.setFromCartesian(-circle.center[0], -circle.center[1], -circle.center[2])
        : out instanceof Float64Array
          ? Vec3Math.copy(circle.center, out)
          : out.setFromCartesian(circle.center)
    ) as T;
  }

  /**
   * Gets the signed distance along an arc from a defined start point to a query point. The start, query, and end
   * points will be projected onto the arc's parent circle if they do not already lie on it. A negative distance
   * indicates that the query point lies somewhere before the start of the arc but after the point on the arc's parent
   * circle that is diametrically opposed to the midpoint of the arc.
   * @param circle The arc's parent circle.
   * @param start The start point of the arc.
   * @param end The end point of the arc.
   * @param pos The query point.
   * @param tolerance The error tolerance, in great-arc radians, when checking if `start` and `query` are equal.
   * Defaults to `GeoCircle.ANGULAR_TOLERANCE` if not specified.
   * @returns The signed distance along the arc from the start point to the query point, in great-arc radians.
   */
  public static getAlongArcSignedDistance(
    circle: GeoCircle,
    start: ReadonlyFloat64Array | LatLonInterface,
    end: ReadonlyFloat64Array | LatLonInterface,
    pos: ReadonlyFloat64Array | LatLonInterface,
    tolerance = GeoCircle.ANGULAR_TOLERANCE
  ): number {
    const posAngularDistance = circle.angleAlong(start, pos, Math.PI);

    if (Math.min(posAngularDistance, MathUtils.TWO_PI - posAngularDistance) <= tolerance) {
      return 0;
    }

    const endAngularDistance = circle.angleAlong(start, end, Math.PI);

    return circle.arcLength((posAngularDistance - (endAngularDistance / 2) + Math.PI) % MathUtils.TWO_PI - Math.PI + endAngularDistance / 2);
  }

  /**
   * Gets the normalized distance along an arc from a defined start point to a query point. The start, query, and end
   * points will be projected onto the arc's parent circle if they do not already lie on it. The distance is normalized
   * such that 1 equals the arc length from the start point to the end point. A negative distance indicates that the
   * query point lies somewhere before the start of the arc but after the point on the arc's parent circle that is
   * diametrically opposed to the midpoint of the arc.
   * @param circle The arc's parent circle.
   * @param start The start point of the arc.
   * @param end The end point of the arc.
   * @param pos The query point.
   * @param tolerance The error tolerance, in great-arc radians, when checking if `start` and `query` are equal.
   * Defaults to `GeoCircle.ANGULAR_TOLERANCE` if not specified.
   * @returns The normalized distance along the arc from the start point to the query point.
   */
  public static getAlongArcNormalizedDistance(
    circle: GeoCircle,
    start: ReadonlyFloat64Array | LatLonInterface,
    end: ReadonlyFloat64Array | LatLonInterface,
    pos: ReadonlyFloat64Array | LatLonInterface,
    tolerance = GeoCircle.ANGULAR_TOLERANCE
  ): number {
    const posAngularDistance = circle.angleAlong(start, pos, Math.PI);

    if (Math.min(posAngularDistance, MathUtils.TWO_PI - posAngularDistance) <= tolerance) {
      return 0;
    }

    const endAngularDistance = circle.angleAlong(start, end, Math.PI);

    if (Math.min(endAngularDistance, MathUtils.TWO_PI - endAngularDistance) <= tolerance) {
      return posAngularDistance >= Math.PI ? -Infinity : Infinity;
    }

    return ((posAngularDistance - (endAngularDistance / 2) + Math.PI) % MathUtils.TWO_PI - Math.PI) / endAngularDistance + 0.5;
  }

  /**
   * Checks if a point lies between the start and end points (inclusive) of an arc along a geo circle. The start, end,
   * and query points will be projected onto the arc's parent circle if they do not already lie on it.
   * @param circle The arc's parent circle.
   * @param start The start point of the arc.
   * @param end The end point of the arc.
   * @param pos The query point.
   * @param tolerance The error tolerance, in great-arc radians.
   * @returns Whether the query point lies between the start and end points (inclusive) of the specified arc.
   */
  public static isPointAlongArc(
    circle: GeoCircle,
    start: ReadonlyFloat64Array | LatLonInterface,
    end: ReadonlyFloat64Array | LatLonInterface,
    pos: ReadonlyFloat64Array | LatLonInterface,
    tolerance?: number,
  ): boolean;
  /**
   * Checks if a point lies between the start and end points (inclusive) of an arc along a geo circle. The start and
   * query points will be projected onto the arc's parent circle if they do not already lie on it.
   * @param circle The arc's parent circle.
   * @param start The start point of the arc.
   * @param angularWidth The angular width of the arc, in radians.
   * @param pos The query point.
   * @param tolerance The error tolerance, in great-arc radians.
   * @returns Whether the query point lies between the start and end points (inclusive) of the specified arc.
   */
  public static isPointAlongArc(
    circle: GeoCircle,
    start: ReadonlyFloat64Array | LatLonInterface,
    angularWidth: number,
    pos: ReadonlyFloat64Array | LatLonInterface,
    tolerance?: number,
  ): boolean;
  // eslint-disable-next-line jsdoc/require-jsdoc
  public static isPointAlongArc(
    circle: GeoCircle,
    start: ReadonlyFloat64Array | LatLonInterface,
    end: ReadonlyFloat64Array | LatLonInterface | number,
    pos: ReadonlyFloat64Array | LatLonInterface,
    tolerance = GeoCircle.ANGULAR_TOLERANCE,
  ): boolean {
    if (typeof end === 'number') {
      if (Math.abs(end) >= MathUtils.TWO_PI - tolerance) {
        return true;
      }

      let angle = circle.angleAlong(start, pos, Math.PI);
      if (angle > MathUtils.TWO_PI - tolerance) {
        angle = 0;
      }
      return (angle - end) * (end >= 0 ? 1 : -1) < tolerance;
    } else {
      const alongArcNorm = FlightPathUtils.getAlongArcNormalizedDistance(circle, start, end, pos, tolerance);
      return isFinite(alongArcNorm) && alongArcNorm >= -tolerance && alongArcNorm <= 1 + tolerance;
    }
  }

  /**
   * Resolves the ingress to egress vectors for a set of flight plan leg calculations. This operation will populate the
   * `ingressToEgress` array with a sequence of vectors connecting the ingress transition to the egress transition
   * while following the flight path defined by the vectors in the `flightPath` array.
   * @param legCalc A set of flight plan leg calculations.
   * @returns The flight plan leg calculations, after the ingress to egress vectors have been resolved.
   */
  public static resolveIngressToEgress<T extends LegCalculations>(legCalc: T): T {
    const vectors = legCalc.ingressToEgress;
    let vectorIndex = 0;

    let flightPathVectorIndex = Math.max(0, legCalc.ingressJoinIndex);

    const lastIngressVector = legCalc.ingress[legCalc.ingress.length - 1];
    const ingressJoinVector = legCalc.flightPath[legCalc.ingressJoinIndex];
    const firstEgressVector = legCalc.egress[0];
    const egressJoinVector = legCalc.flightPath[legCalc.egressJoinIndex];

    if (lastIngressVector && ingressJoinVector) {
      const ingressEnd = FlightPathUtils.geoPointCache[0].set(lastIngressVector.endLat, lastIngressVector.endLon);
      const vectorEnd = legCalc.ingressJoinIndex === legCalc.egressJoinIndex && firstEgressVector
        ? FlightPathUtils.geoPointCache[1].set(firstEgressVector.startLat, firstEgressVector.startLon)
        : FlightPathUtils.geoPointCache[1].set(ingressJoinVector.endLat, ingressJoinVector.endLon);

      if (!ingressEnd.equals(vectorEnd)) {
        const ingressJoinVectorCircle = FlightPathUtils.setGeoCircleFromVector(ingressJoinVector, FlightPathUtils.geoCircleCache[0]);

        FlightPathUtils.setCircleVector(
          vectors[vectorIndex] ??= FlightPathUtils.createEmptyCircleVector(),
          ingressJoinVectorCircle, ingressEnd, vectorEnd,
          ingressJoinVector.flags
        );
        vectorIndex++;
      }

      flightPathVectorIndex++;
    }

    const end = Math.min(legCalc.flightPath.length, legCalc.egressJoinIndex < 0 ? Infinity : legCalc.egressJoinIndex);
    for (let i = flightPathVectorIndex; i < end; i++) {
      Object.assign(vectors[vectorIndex] ??= FlightPathUtils.createEmptyCircleVector(), legCalc.flightPath[i]);
      vectorIndex++;
      flightPathVectorIndex++;
    }

    if (flightPathVectorIndex === legCalc.egressJoinIndex && egressJoinVector) {
      if (firstEgressVector) {
        const egressStart = FlightPathUtils.geoPointCache[0].set(firstEgressVector.startLat, firstEgressVector.startLon);
        const egressJoinVectorStart = FlightPathUtils.geoPointCache[1].set(egressJoinVector.startLat, egressJoinVector.startLon);
        if (!egressStart.equals(egressJoinVectorStart)) {
          const egressJoinVectorCircle = FlightPathUtils.setGeoCircleFromVector(egressJoinVector, FlightPathUtils.geoCircleCache[0]);

          FlightPathUtils.setCircleVector(
            vectors[vectorIndex] ??= FlightPathUtils.createEmptyCircleVector(),
            egressJoinVectorCircle, egressJoinVectorStart, egressStart,
            egressJoinVector.flags
          );
          vectorIndex++;
        }
      } else {
        Object.assign(vectors[vectorIndex] ??= FlightPathUtils.createEmptyCircleVector(), egressJoinVector);
        vectorIndex++;
      }
    }

    vectors.length = vectorIndex;

    return legCalc;
  }
}