//@Injectable()
  export class TaylorConstants {
    public static RESERVOIR_FULL_ACFT = 106200.00; // ACFT (Acre Feet)
    public static RESERVOIR_FILL_ACFT = 94974.00;  // ACFT (Acre Feet)
    
    public static YEAR_BEGINNING_VOLUME_ACFT = 68005.00; // ACFT (Acre Feet)
	
    public static RESERVOIR_FULL_WATER_HEIGHT_FT =	9330.00; // FT (Feet)
    public static RESERVOIR_MAX_WATER_HEIGHT_FT  =	9329.00; // FT (Feet)
    public static RESERVOIR_MAX_WATER_HEIGHT_WARNING_FT	= 9327.00;
    
    public static RESERVOIR_SURFACE_WATER_AREA_AC =	2000.00;	// AC (Acres)
    public static RESERVOIR_MAX_SURFACE_WATER_ELEVATION_FT = 9337.20	//Ft (Feet)
    
    public static DAM_HEIGHT_FT = 206.80;	//Ft (Feet)
    public static DAM_LENGTH_FT = 675.00;	//Ft (Feet)
    public static DAM_CREST_ELEVATION_FT = 9343.00;	//Ft (Feet)
    public static DAM_OUTLET_FT = 10.00;	//Ft (Feet) in Diameter
    public static DAM_OUTLET_WATER_CAPACITY_CFS = 1500.00;	// CFS (Cubic Feet/ Second)
    public static SPILLWAY_CREST_ELEVATION_FT = 9330.00;	//Ft (Feet)
    public static SPILLWAY_LENGTH_FT = 180.00;	//Ft (Feet)
    public static SPILLLWAY_WATER_CAPACITY_CFS = 10000.00;	//CFS (Cubic Feet/ Second)
    public static TOP_OF_ACTIVE_CONSERVATION_POOL_FT = 9330.00;	//Ft (Feet)
    public static TOP_OF_INACTIVE_CONSERVATION_POOL_FT = 9183.00;	//Ft (Feet)

    //Unit Conversions		
    public static ACRE_TO_SQFT = 43560; //1 Acre	43,560.00	Square Feet
    public static ACRE_TO_CUBICFT = 43599.90; //1 AF (Acre Foot)	43,559.90	CF (Cubic Feet)
    public static SECONDS_PER_DAY = 86400; //Seconds Per day	86,400.00	Seconds
    public static SQFT_TO_ACFT = 1/(this.ACRE_TO_SQFT); // 1 SQFT (Square Foot)	0.0000229569	AF (Acre Foot)

    // Page 7 
    // Year type        A year in which the Forecasted Inflow is:
    // Dry Year        Less than 75,000 acre-feet
    // Average Year    equal to or greater than 75,000 acre feet but less than 110,000 acre-feet
    // Wet Year        equal to or greater than 110,000 acre-feet
    
    //Range - Low	Range - High	Storage Objective	Constant	CFS
    //Page 7 - Dry Year	0.00 < 75,000.00			
    //Page 7 - Average Year	75,000.00 < 110,000.00	70,000.00		
    //Page 7 - Wet Year	>= 110,000.00	999,999.00	75,000.00		

    public static DRY_YEAR_RANGE_ACFT     = {low:0.000, high: 74999.999, minimumStorageObjective_10_31: 60000}; // minimum storage based on table. Page 8
    public static AVERAGE_YEAR_RANGE_ACFT = {low:75000.000, high: 109999.999, minimumStorageObjective_10_31: 70000 };
    public static WET_YEAR_RANGE_ACFT     = {low:110000.00, high: 1110000.000, minimumStorageObjective_10_31: 75000};


					
	// Minimum - Oct	Max - Oct	CFS	Constant	Base
    // Page 11 - Range  1	75000.00	110000.00	100	0.000	0.00
    // Page 11 - Range  2	70000.00	75000.00	85	0.003	70,000.00
    // Page 11 - Range  3	60000.00	70000.00	75	0.001	60,000.00
    // Page 11 - Range  4	0.00	60000.00	50	0.000	0.00
    					
	// Percent of Normal	April-July Inflow	Max Content		
    // November Forecast 2021	0.0000%	0	0		
    // Decemeber Forecast 2021	0.0000%	0	0		
    // January 1st Forecast	102.0000%	98,000	92,920		
    // February 15th Forecast	99.0000%	93,000	95,332		
    // March 1st Forecast	102.0000%	96,000	94,975		
    // April Forecast	0.0000%	0	0		
    // May Forecast	0.0000%	0	0		
    // June Forecast	0.0000%	0	0		
    // July Forecast	0.0000%	0	0		
    // August Forecast	0.0000%	0	0		
    // September Forecast	0.0000%	0	0		
    // October Forecast	0.0000%	0	0		
    



    
  }