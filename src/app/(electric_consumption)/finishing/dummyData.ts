// dummyData.ts

export const dummyMachines: Machine[] = [
  {
    MachineID: 1,
    MachineName: 'MONFORT SHED 1',
    Status: 'ON',
    Consumption: [
      { UtilityType: 'Electricity', Instantaneous: 26.5, TillNow: 1958458, Unit: 'kW' },
      { UtilityType: 'Steam', Instantaneous: 1.25, TillNow: 968547, Unit: 'TON/H' },
      { UtilityType: 'Water', Instantaneous: 0.54, TillNow: 36584457, Unit: 'LIT/M' },
    ],
  },
  {
    MachineID: 2,
    MachineName: 'BENNINGER MERCERIZE',
    Status: 'OFF',
    Consumption: [
      { UtilityType: 'Electricity', Instantaneous: 15.3, TillNow: 1200000, Unit: 'kW' },
      { UtilityType: 'Gas', Instantaneous: 2.1, TillNow: 50000, Unit: 'm³/H' },
    ],
  },
  {
    MachineID: 3,
    MachineName: 'HTP SANFOR',
    Status: 'ON',
    Consumption: [
      { UtilityType: 'Electricity', Instantaneous: 18.7, TillNow: 1500000, Unit: 'kW' },
      { UtilityType: 'Steam', Instantaneous: 1.1, TillNow: 800000, Unit: 'TON/H' },
      { UtilityType: 'Water', Instantaneous: 0.45, TillNow: 30000000, Unit: 'LIT/M' },
    ],
  },
];

// types.ts
export interface Consumption {
  UtilityType: string;
  Instantaneous: number;
  TillNow: number;
  Unit: string;
}

export interface Machine {
  MachineID: number;
  MachineName: string;
  Status: string;
  Consumption: Consumption[];
}