export interface ContractCreateHeroMessageContent {
  hero: { 
    typeKey: string, 
    name: string,
    eyesId: number,
    noseId: number,
    mouthId: number
  };
}