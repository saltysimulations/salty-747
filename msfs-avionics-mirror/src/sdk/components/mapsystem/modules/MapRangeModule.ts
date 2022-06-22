import { NumberUnitInterface, SimpleUnit, UnitFamily, UnitType } from '../../../math/NumberUnit';
import { NumberUnitSubject } from '../../../math/NumberUnitSubject';
import { MapProjectionParameters } from '../../map';
import { MapSystemContext } from '../MapSystemContext';
import { AbstractMapModule } from './AbstractMapModule';

/**
 * A module describing the nominal range of a map.
 */
export class MapRangeModule extends AbstractMapModule {

  /** The range of the map as a number unit. */
  public readonly nominalRange = NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(1));

  private readonly projectionParams: MapProjectionParameters = {
    range: this.nominalRange.get().asUnit(UnitType.GA_RADIAN)
  };

  /**
   * Creates an instance of a MapRangeModule.
   * @param mapSystemContext The map system context to use with this instance.
   */
  constructor(mapSystemContext: MapSystemContext = MapSystemContext.Empty) {
    super(mapSystemContext);
  }

  private readonly rangeHandler = (range: NumberUnitInterface<UnitFamily.Distance, SimpleUnit<UnitFamily.Distance>>): void => {
    this.projectionParams.range = range.asUnit(UnitType.GA_RADIAN);
    this.mapSystemContext.projection.setQueued(this.projectionParams);
  };

  /** @inheritdoc */
  public startSync(): void {
    this.nominalRange.sub(this.rangeHandler, true);
  }

  /** @inheritdoc */
  public stopSync(): void {
    this.nominalRange.unsub(this.rangeHandler);
  }
}