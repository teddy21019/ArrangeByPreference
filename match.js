//檔案資料
let json;

//物件資料
let plan = [];
let people = [];
let is_done = false;       //指示完成最佳安排，無須繼續執行

//繪圖資料
let width = 600;
let height = 600;
let pos_x_of_name = width / 4;
let pos_x_of_plan = width * 3 / 4;
let min_pos_y = height / 7
let space_between_y = height * 5 / 7;


function setup() {
    createCanvas(600, 600);
}

function draw() {
    background(0);

    ///------顯示字---/
    for (let i = 0; i < people.length; i++) {
        textSize(20);
        fill(255);
        text(people[i].name, people[i].x, people[i].y);
    }
    for (let i = 0; i < plan.length; i++) {
        textSize(20);
        fill(255);
        text(plan[i].name, plan[i].x, plan[i].y);
    }
    /////////////

    


}

function getXLSData(json) {
    json = JSON.parse(json);                //因為轉換物件為json檔而非Array，在這邊擷取出
    jsonToObjectData(json);
}

function jsonToObjectData(json) {
    rows = Object.keys(json[0])
    let plan_name = rows.slice(1);                      //教案名稱與    slice(1)是因為第一欄是「"名字"」
    let people_name = [];
    let number_of_people = json.length;

    for (let i = 0; i < plan_name.length; i++) {        //根據各教案名稱，建立教案物件
        let max_people = json[0][plan_name[i]];         //引入教案所需人數
        let new_plan = new Plan(plan_name[i], max_people);
        new_plan.pos = {                                //pos 是為了用p5畫圖
            x: pos_x_of_plan,
            y: min_pos_y + space_between_y / plan_name.length * (i + .5)
        };

        plan.push(new_plan);                    //加入教案陣列
    }

    for (let i = 1; i < number_of_people; i++) {        //第0筆資料是教案所需人數，因此從i=1開始
        let name = json[i][rows[0]];                    //json[i]指的是第i位同學，而rows[0]特別指"名字"這個title
        people_name.push(name);

        let new_people = new People(name);
        new_people.pos = {
            x: pos_x_of_name,
            y: min_pos_y + space_between_y / number_of_people * i
        };

        //登記排名：Array of Plan
        let rank = []
        for (let j = 0; j < plan_name.length; j++) {
            rank.push(int(json[i][plan_name[j]]))    //json[i] 得到該新生資料，plan_name[j] 是第j個教案。取得第j個教案的排名
        }
        new_people.rank_favor = rank;

        people.push(new_people);
    }
}

class Plan {
    constructor(name, max_p) {
        this.name = name;           //教案名稱
        this.max_people = max_p;
        this.people_to_deal = 0;    //多餘人數
        this.rank_undone = 0;       //未完成度排名。多餘人數越多排名越高

    }

    static doRank(list) {       //根據還有多少人未被安排來排序
        return list.slice().sort((m, n) => n.people_to_deal - m.people_to_deal)
    }
    set pos(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }




}

class People {
    constructor(name) {
        this.name = name;
        this.rank_favor = [];       //記錄了對各教案的志願序
    }

    set pos(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

}