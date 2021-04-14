import { Observable } from 'rxjs';
import { ValueChangeEvent } from './value-change-event';

interface ValueModifier {
  key: any;
  amount: number;
}

export class ValueContainer {
  public value: number;
  public onValueChange: Observable<ValueChangeEvent<number>> = new Observable();

  private baseValue: number;
  private additiveModifiers: ValueModifier[] = [];
  private additiveValueContainers: ValueContainer[] = [];
  private multiplicativeModifiers: ValueModifier[] = [];
  private multiplicativeValueContainers: ValueContainer[] = [];

  public constructor (baseValue?: number) {
    this.baseValue = baseValue ? baseValue : 0;
    this.value = this.baseValue;
  }

  public setAdditiveModifier(key: any, amount: number): void {
    const previousModifier = this.additiveModifiers.find(mod => mod.key === key);
    if (previousModifier) {
      previousModifier.amount = amount;
    } else {
      this.additiveModifiers.push({ key: key, amount: amount });
    }
    this.recalculateValue();
  }

  public setAdditiveValueContainer (valueContainer: ValueContainer) {
    const exists = this.additiveValueContainers.includes(valueContainer);
    if (!exists) {
      this.additiveValueContainers.push(valueContainer);
      this.setAdditiveModifier(valueContainer, valueContainer.value);
      this.recalculateValue();
      valueContainer.onValueChange.subscribe(valueChange => {
        this.setAdditiveModifier(valueContainer, valueChange.newValue);
        this.recalculateValue();
      });
    }
  }


  public setMultiplicativeModifier(key: any, amount: number): void {
    const previousModifier = this.multiplicativeModifiers.find(mod => mod.key === key);
    if (previousModifier) {
      previousModifier.amount = amount;
    } else {
      this.multiplicativeModifiers.push({ key: key, amount: amount });
    }
    this.recalculateValue();
  }

  public setMultiplicativeValueContainer (valueContainer: ValueContainer) {
    const exists = this.multiplicativeValueContainers.includes(valueContainer);
    if (!exists) {
      this.multiplicativeValueContainers.push(valueContainer);
      this.setMultiplicativeModifier(valueContainer, valueContainer.value);
      this.recalculateValue();
      valueContainer.onValueChange.subscribe(valueChange => {
        this.setMultiplicativeModifier(valueContainer, valueChange.newValue);
        this.recalculateValue();
      });
    }
  }

  public removeModifiers(key: any): void {
    if (this.additiveModifiers.some(mod => mod.key === key)) {
      this.additiveModifiers = this.additiveModifiers.filter(mod => mod.key !== key);
    }
    if (this.multiplicativeModifiers.some(mod => mod.key === key)) {
      this.multiplicativeModifiers = this.multiplicativeModifiers.filter(mod => mod.key !== key);
    }
    this.recalculateValue();
  }

  private recalculateValue(): void {
    let newValue = this.baseValue;
    for (const modifier of this.additiveModifiers) {
      newValue += modifier.amount;
    }
    for (const modifier of this.multiplicativeModifiers) {
      newValue *= modifier.amount;
    }
    this.value = newValue;
  }
}
