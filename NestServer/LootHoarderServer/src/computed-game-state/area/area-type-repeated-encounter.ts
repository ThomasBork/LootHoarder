import { WeightedElement } from "../weighted-element";
import { AreaTypeEncounter } from "./area-type-encounter";

export class AreaTypeRepeatedEncounter {
  public repetitionAmount: number;
  public weightedEncounters: WeightedElement<AreaTypeEncounter>[];

  public constructor(
    repetitionAmount: number,
    weightedEncounters: WeightedElement<AreaTypeEncounter>[],
  ) {
    this.repetitionAmount = repetitionAmount;
    this.weightedEncounters = weightedEncounters;
  }
}
