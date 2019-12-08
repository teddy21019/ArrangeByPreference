l = [
    [3, 2, 1, 4],   //1
    [3, 1, 2, 4],   //2
    [4, 3, 1, 2],   //3
    [4, 2, 1, 3],   //4
    [3, 1, 2, 4],   //5
    [3, 2, 1, 4],   //6
    [2, 3, 1, 4],   //7
    [2, 3, 1, 4],   //8
    [2, 1, 4, 3],   //9
    [1, 4, 2, 3]    //10
]

// l = [
//     [1, 2, 3, 4],   //1
//     [1, 3, 2, 4],   //2
//     [1, 3, 2, 4],   //3
//     [1, 3, 2, 4],   //4
//     [3, 2, 1, 4],   //5
//     [2, 3, 1, 4],   //6
//     [1, 3, 2, 4],   //7
//     [1, 2, 3, 4],   //8
//     [1, 2, 3, 4],   //9
//     [1, 3, 2, 4]    //10
// ];

/**
 * PlanName     People
 * plan 1       3~4 
 * plan 2       2~3
 * plan 3       3~5
 * plan 4       2~3
 */
let maxPeople = [4, 3, 5, 3];  //the max number of people of each plan
let minPeople = [3, 2, 3, 2];  //the min number of people
let numPeople = l.length;
let numPlans = l[0].length;
let peopleNeeded = maxPeople.slice();   //make a copy
/**
 * We have to first distribute the people of each plan, given that the people might not be enough,
 * as well as check whether people exceeds.
 */
try {
    if (numPeople > sumList(maxPeople)) throw "EXCEED";
    else if (numPeople < sumList(minPeople)) throw "NOT_ENOUGH";
    
    //redistribute
    let peopleExceeded = sumList(maxPeople) - numPeople;
    for (let i = peopleExceeded; i > 0; i--) {
        for (let j = 1; j < numPlans; j++) {
            let planToDel = getIndexByRank(peopleNeeded, j, false);    //pick the one with max people
            if (peopleNeeded[planToDel] - 1 < minPeople[planToDel]) {
                continue;
            } else {
                peopleNeeded[planToDel]--;
                break;
            }
        }
    }
    console.log(peopleNeeded);
    main();
} catch (error) {
    if (error == "EXCEED") console.log("錯誤: 太多人");
    else if (error == "NOT_ENOUGH") console.log("錯誤: 人不夠");
}

function main() {
    let names = Array.from({ length: numPeople }, (v, i) => "name" + (i + 1));     //just naming
    let plans = Array.from({ length: numPlans }, (v, i) => "plan" + (i + 1));

    /**
     * creates a new 2d array [ [],[],[],[]... ], 
     * and is created to contain the users' id that picked the plan
     * for example: If currently id=1,5,6 chooses plan1, id=2,4,9,10 people chooses plan 2, etc.
     * then the array will be [[1,5,6],[2,4,9,10]]
     * 
     * This style of creating nested arrays uses the keyword "from"
     * */
    let pairPeoplePlan = Array.from({ length: numPlans }, v => []);

    /**
     * First step of this algorithm, is to pair each person to the plan one ranks the highest.
     * After assigning all people to all plans, we have to check whether the pairing is valid
     * since there exist an certain number for each plan, defined in the array "max_people".
     */
    for (let i = 0; i < numPeople; i++) {
        let indexTopRank = getIndexByRank(l[i], 1, true);
        pairPeoplePlan[indexTopRank].push(i);
    }
    // subscribe the max number of each plan to the current arrangement
    let peopleToHandle = pairPeoplePlan.map((val, i) => val.length - peopleNeeded[i]);    //used the "map" technique

    /**
     * 
     * After the arrangement, we have to find the plan that has the most exceeded number
     * of people. We go through everone that choses this plan, and see whether their second
     * preference matches the plan that craves for people to pair with. 
     * 
     * If going through their second preference failed to pair any one of them, then go on 
     * and try their third preference.
     *
     * Once a plan is fullfilled, jump to next.
     * 
     * If sucessfully paired in this step, then recalculate the "plan_people_pair" array,
     * and repeat the above process.'
     * 
     */
    while (peopleToHandle.map(x => x * x).reduce((a, b) => a + b) > 0) {      //if not all zero
        //get the index that has the most exceed number
        let indexMaxExceedPlan = getIndexByRank(peopleToHandle, 1, false);
        let indexMaxShortPlan = getIndexByRank(peopleToHandle, 1, true);

        /**
         * get the index of people that has chose the plan that has the most people to handle
         * should return something like [0,2,3,5,6,7]
         */
        let indeciesPeopleToHandle = pairPeoplePlan[indexMaxExceedPlan].slice();

        //start from rank=2, if nothing changed, go to rank=3, and so on
        for (let r = 2; r <= numPlans; r++) {
            let didSomething = false;
            let peopleLeft = peopleToHandle[indexMaxShortPlan];
            indeciesPeopleToHandle.forEach(person => {
                if (getIndexByRank(l[person], r) == indexMaxShortPlan && peopleLeft != 0) {
                    //delete that person from previous pair
                    let listToDel = pairPeoplePlan[indexMaxExceedPlan];
                    pairPeoplePlan[indexMaxExceedPlan].splice(listToDel.indexOf(person), 1);  //remove person

                    //add that person to new pair
                    pairPeoplePlan[indexMaxShortPlan].push(person);     //add person
                    peopleLeft++;
                    didSomething = true;
                }
            });
            if (didSomething) {
                break;
            }
        }

        //refresh people_to_handle
        // console.log(plan_people_pair);
        peopleToHandle = pairPeoplePlan.map((val, i) => val.length - peopleNeeded[i]);
    }

    pairPeoplePlan.forEach((element, i) => {
        element.sort();
        console.log(plans[i] + ":");
        element.forEach(person => {
            console.log(names[person]);
        });
        console.log("\n");
    });
}




/**
 * @param {Array}   list 
 * @param {Number}  rank
 * @param {Boolean} rank_mode: 
 *      True:Ascend     small to big. 
 *      False:Descend   big to small.
 */
function getIndexByRank(list, rank, rank_mode = true) {
    let result = list.map((item, index) => [item, index])
        .sort(([index1], [index2]) => (index1 - index2) * (rank_mode ? 1 : -1))
        .map(([, item]) => item);
    return result[rank - 1];
}

function sumList(list) {
    return list.reduce((a, b) => a + b);
}





