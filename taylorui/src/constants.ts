//Grid title label constants

export const ELEVATIONGRIDTITLE  = 'Taylor Park Reservior Level';
export const ELEVATIONGRIDYLABEL = 'Water Elevation (ft)'
export const ELEVATIONGRIDXLABEL = 'Months'

//Water Level Constants
export const WARNING_ELEVATION_LEVEL   = 9327;
export const MAX_ELEVATION_LEVEL       = 9329;

//graph-colors
//https://htmlcolorcodes.com/color-names/
//The fourth value denotes alpha and needs to be between 0.0 (absolute transparency) and 1.0 (absolute opacity). For example, 0.5 would be 50% opacity and 50% transparency.
//Yellow	        #FFFF00	rgb(255, 255, 0)
//LightYellow	    #FFFFE0	rgb(255, 255, 224)
//CornflowerBlue	#6495ED	rgb(100, 149, 237, .5)
//Blue	            #0000FF	rgb(0, 0, 255, .5)
//Salmon	        #FA8072	rgb(250, 128, 114)
//Red	            #FF0000	rgb(255, 0, 0)
//BlueViolet	    #8A2BE2	rgb(138, 43, 226)
//MediumPurple	    #9370DB	rgb(147, 112, 219, .5)
//LightCoral	    #F08080	rgb(240, 128, 128) 
//grey              #495057 rgb(73, 80, 87)
//light grey        #ebedef rgb(235, 237, 239)

export const ADJUST_LABEL             = 'Adjusted Water Elevation';
export const ADJUST_GRID_LINECOLOR    = 'rgb(138, 43, 226)';       //BlueViolet
export const ADJUST_GRID_BACKGROUND   = 'rgb(147, 112, 219, .5)';  //MediumPurple

export const PROPOSED_LABEL           = 'Proposed Water Elevation';
// = 'rgb(0, 0, 0, .5)';      //Black
export const PROPOSED_GRID_LINECOLOR  = 'rgb(0, 0, 255, .5)';      //Blue
export const PROPOSED_GRID_BACKGROUND = 'rgb(100, 149, 237, .5)';  //CornflowerBlue
export const INFLOW_LABEL             = 'Inflow';
export const INFLOW_GRID_LINECOLOR    = 'rgb(0, 0, 255, .5)';      //Blue
export const OUTFLOW_LABEL            = 'Outflow';
export const OUTFLOW_GRID_LINECOLOR   = 'rgb(0, 255, 0, .5)';      //Green

export const MAX_LABEL                = 'Max Water Elevation';
export const WARNING_GRID_LINECOLOR   = 'rgb(255, 255, 0)';        //Yellow
export const WARNING_GRID_BACKGROUND  = 'rgb(255, 255, 224)';      //LightYellow

export const WARNING_LABEL            = 'Warning Water Elevation';
export const MAX_GRID_LINECOLOR       = 'rgb(255, 0, 0)';          //Red
export const MAX_GRID_BACKGROUND      = 'rgb(250, 128, 114)';      //Salmon

export const DATE_LABEL               = 'Date Line';                    //#2F4F4F
export const DATE_GRID_LINECOLOR      = 'rgb(47, 79, 79)';         //DarkSlateGray rgb(47, 79, 79)
export const DATE_GRID_BACKGROUND     = 'rgb(47, 79, 79)';         //DarkSlateGray

export const EOM_WARNING_LEVEL        = 'rgb(255, 255, 0)';        //yellow
export const EOM_MAX_LEVEL            = 'rgb(240, 128, 128)';      //LightCoral

export const GRID_LEGEND_LABEL        = 'rgb(73, 80, 87)';         //grey
export const GRID_SCALES_LABEL        = 'rgb(235, 237, 239)';      //light grey

export const CELL_CHANGE_COLOR        = 'rgb(147, 112, 219, .4)';  //MediumPurple
export const INFLOW_SUMMARY_COLOR     = 'rgb(152, 251, 152)';  //PaleGreen

//Type of year
export const DRY_YEAR = {"low":0.00,     "high": 74999.999};
export const AVG_YEAR = {"low":75000.0,  "high": 109999.999};
export const WET_YEAR = {"low":110000.0, "high": 999999.0};

export const DRY_YEAR_LABEL = " Dry Year";
export const AVG_YEAR_LABEL = " Avg Year";
export const WET_YEAR_LABEL = " Wet Year";

export const DRY_YEAR_BACKGROUND = 'rgb(207, 159, 50)';   // Brownish #cf9f32
export const AVG_YEAR_BACKGROUND = 'rgb(52, 214, 41)';    // green #34d629
//export const WET_YEAR_BACKGROUND = 'rgb(50, 121, 207)'; // blue #3279cf
export const WET_YEAR_BACKGROUND = 'rgb(0, 191, 255)';    // DeepSkyBlue	#00BFFF	

export const DRY_YEAR_BACKGROUND_ANALYTICS = 'rgb(207, 159, 50, .5)';   // Brownish #cf9f32
export const AVG_YEAR_BACKGROUND_ANALYTICS = 'rgb(52, 214, 41, .5)';    // green #34d629
export const WET_YEAR_BACKGROUND_ANALYTICS = 'rgb(0, 191, 255, .5)';    // DeepSkyBlue	#00BFFF	

//conversions
export const ACTOSQFT  = 43560.0;
export const SECONDSPERDAY = 86400;

export const MONTHS = [
    {"month":"January", "abrev":"Jan"}, 
    {"month":"February", "abrev":"Feb"}, 
    {"month":"March", "abrev":"Mar"}, 
    {"month":"April", "abrev":"Apr"}, 
    {"month":"May", "abrev":"May"}, 
    {"month":"June", "abrev":"Jun"}, 
    {"month":"July", "abrev":"Jul"}, 
    {"month":"August", "abrev":"Aug"}, 
    {"month":"September", "abrev":"Sep"}, 
    {"month":"October", "abrev":"Oct"}, 
    {"month":"November", "abrev":"Nov"}, 
    {"month":"December", "abrev":"Dec"}
]
