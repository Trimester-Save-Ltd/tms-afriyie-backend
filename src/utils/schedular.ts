import path from 'path';
import Bree from "bree";
import Cabin from "cabin";


export const bree = new Bree({
    root: path.join(__dirname, '../jobs/'),
    defaultExtension: path.basename(__filename).endsWith('.js') ? 'js' : 'ts',
    acceptedExtensions: ['js','ts'],
    logger: new Cabin(),
    jobs: [
        {
            name: 'vital',
            interval: "10s",
        }
    ]

});

// /**
//  * @description - BreeSchedular class to construct scheduling jobs
//  */
// class BreeSchedular {
//     options = {
//         root: path.join(__dirname, '../jobs/*'),
//         // defaultExtension: 'ts',
//         acceptedExtensions: ['js','ts'],
//         logger: new Cabin(),
//         jobs: [
//             {
//                 name: 'test',

//             }
//         ]

//     }
//     constructor() { }

//     /**
//      * @description: schedular
//      * @param option - options to be passed to bree constructor
//      * @returns Bree instance, that contains all necessary methods to start and stop jobs
//      */
//     public schedular(option = this.options) {
//         return new Bree(option);
//     }
    
// }

// export default BreeSchedular;
