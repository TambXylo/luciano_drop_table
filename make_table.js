var stage_table = [];
var filtered_stage_table = [];

function test_alert(str) {
    alert(str)
}

//https://uxmilk.jp/11586
function get_csv(csv_file) {
    var req = new XMLHttpRequest();
    req.open("get", csv_file, true);
    req.send(null);

    req.onload = function () { convert_csv_to_array(req.responseText); }
}

function convert_csv_to_array(csv_text) {
    var result = [];
    var tmp = csv_text.split("\n");

    for (var i = 1; i < tmp.length; i++) {
        result[i - 1] = tmp[i].split(',');
    }

    //shift()で項目行削除しようとしたら何故か項目行だけが残るんすね～～
    //なんで？？？？？？？(仕方ないので上記for文内で i = 1 スタートにしました)
    //result = result.shift();
    //alert(result);
    shape_array_for_stage_table(result);
}

function shape_array_for_stage_table(array) {
    for (var i = 0; i < array.length; i++) {
        array[i][2] = array[i][2].split(' ');
    }

    stage_table = JSON.parse(JSON.stringify(array));
    filtered_stage_table = JSON.parse(JSON.stringify(array));
    update_webpage_table();
}

function filter_stage_table_from_item_id(item_id) {
    if (item_id === "all") {
        filtered_stage_table = Array.from(stage_table);
    } else {
        filtered_stage_table = stage_table.filter(stage => stage[2].includes(item_id));
    }
    update_webpage_table()
}

//https://qiita.com/izcomaco/items/7ef5a08a9c542d84907b
function update_webpage_table() {
    reset_webpage_table()
    var web_table = JSON.parse(JSON.stringify(filtered_stage_table));
    web_table = insert_image_for_table(web_table, 2)

    var column_length = web_table.length;
    var row_length = web_table[0].length;
    var tbody = document.getElementById("stage_table");

    for (i = 0; i < column_length; i++) {
        var tr = document.createElement("tr");
        for (j = 1; j < row_length; j++) {
            var td = document.createElement("td");
            td.innerHTML = web_table[i][j];
            //alert("done!");
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function reset_webpage_table() {
    var tbody = document.getElementById("stage_table");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function insert_image_for_table(table, column) {
    var column_length = table.length;
    for (i = 0; i < column_length; i++) {
        var value_length = table[i][column].length;
        for (j = 0; j < value_length; j++) {
            table[i][column][j] = "<img src='images/item" + table[i][column][j] + ".png' width='30px' height='30px'>"
        }
        table[i][column] = table[i][column].join(' ')
    }
    return table;
}

//startup_webpage();
get_csv("csv/stage_data.csv");

//function startup_webpage() {
//    const promise = new Promise((resolve, reject) => get_csv("csv/stage_data.csv"));
//    promise.then(update_webpage_table())
//}