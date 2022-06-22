import { ArraySubject, Subject } from '../../..';
import { BingComponent } from '../../bing';
import { AbstractMapModule } from './AbstractMapModule';

/**
 * A map data module that controls the terrain color reference point.
 */
export class MapColorsModule extends AbstractMapModule {
  /** The current map terrain colors reference point. */
  public terrainReference = Subject.create(EBingReference.SEA);

  /** The current map colors array. */
  public colors = ArraySubject.create(BingComponent.createEarthColorsArray('#0000FF', [
    {
      elev: 0,
      color: '#000000'
    },
    {
      elev: 60000,
      color: '#000000'
    }
  ]));
}