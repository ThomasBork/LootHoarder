import { Observable, Subject } from 'rxjs';
import { ValueChangeEvent } from './value-change-event';

interface ValueModifier {
  key: any;
  amount: number;
}

export class ValueContainer {
  public onValueChange: Subject<ValueChangeEvent<number>> = new Subject();
  
  private _value: number;
  private _baseValue: number;
  private additiveModifiers: ValueModifier[] = [];
  private additiveValueContainers: ValueContainer[] = [];
  private multiplicativeModifiers: ValueModifier[] = [];
  private multiplicativeValueContainers: ValueContainer[] = [];

  public constructor (baseValue?: number) {
    this._baseValue = baseValue ? baseValue : 0;
    this._value = this._baseValue;
  }

  public get value(): number {
    return this._value;
  }

  public get baseValue(): number {
    return this._baseValue;
  }

  public set baseValue(newBaseValue: number) {
    this._baseValue = newBaseValue;
    this.recalculateValue();
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
      this.setAdditiveModifier(valueContainer, valueContainer._value);
      valueContainer.onValueChange.subscribe(valueChange => {
        this.setAdditiveModifier(valueContainer, valueChange.newValue);
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

  public setMultiplicativeValueContainer (valueContainer: ValueContainer, modificationExpression?: (value: number) => number) {
    const exists = this.multiplicativeValueContainers.includes(valueContainer);
    if (!exists) {
      this.multiplicativeValueContainers.push(valueContainer);
      let value = valueContainer.value;
      if (modificationExpression) {
        value = modificationExpression(value);
      }
      this.setMultiplicativeModifier(valueContainer, value);
      valueContainer.onValueChange.subscribe(valueChange => {
        let value = valueChange.newValue;
        if (modificationExpression) {
          value = modificationExpression(value);
        }
        this.setMultiplicativeModifier(valueContainer, value);
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
    let newValue = this._baseValue;
    for (const modifier of this.additiveModifiers) {
      newValue += modifier.amount;
    }
    for (const modifier of this.multiplicativeModifiers) {
      newValue *= modifier.amount;
    }
    const previousValue = this._value;
    const didValueChange = previousValue !== newValue;
    if (didValueChange) {
      this._value = newValue;
      this.onValueChange.next({ previousValue, newValue });
    }
  }
}
