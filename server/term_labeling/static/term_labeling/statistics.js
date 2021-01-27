let table
let table2
let Excel
var currentPeriod="all periods"
// connect to server and get the created word cloud based on period parameter.
var frequency = [10,20,30,50,70,80,100,200,300,400,500,1000]
var range= ['0-50', '50-100', '100-150', '150-200', '200-250', '250-300', '300-350', '350-400', '400-450',
            '450-500', '500-550', '550-600', '600-650', '650-700', '700-750', '750-800', '800-850', '850-900', '900-950', '950-1000']


$(document).ready(function() {
    table = $('#listTable').DataTable( {
        responsive: true,
        "pageLength": 100,
         columns: [
            { title: "#" },
            { title: "Term" },
            { title: "Frequency" },
            { title: "Approximate Proportion" },
            { title: "Percent of Total" },
        ]
    } );
    table2 = $('#tagTable').DataTable( {
        responsive: true,
        "pageLength": 10,
         columns: [
            { title: "#" },
            { title: "Term" },
            { title: "Frequency" },
            { title: "Percent of Total" },
        ]
    } );
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
       });
} );

function Create_frequency_array(number){
    var array = frequency.slice()
    var i = 0;
    while (i < array.length && array[i]<number) {
        i++;
    }
    if (i < array.length){
        array = array.slice(0,i)
        if(array[i] != number){
            array.push(number)
         }
    }
    return array.reverse()
}


function Create_range_array(number){
     var array = range.slice()
     var i = 0;
     var temp = ""
     while (i < array.length) {
        temp = array[i].split('-')
        first = parseInt(temp[0])
        second = parseInt (temp[1])
        if (number> first && number<second){
            break;
        }
        i++;
     }
      if (i < array.length){
        array = array.slice(0,i)
        temp[1] = number.toString()
        array.push(temp[0]+'-'+temp[1])
      }
      return array

}

function get_terms_freq(f , n , p) {
    return $.ajax({
        type: "GET",
        url: "get_terms_freq/",
        data: {'f': f,'n':n,'p':p},
        dataType: "json",
    });
}

function get_max_freq(p) {
    return $.ajax({
        type: "GET",
        url: "maxFrequencyinPeriod/",
        data: {'p':p},
        dataType: "json",
    });
}

function get_all_tags_for_poet(id) {
    return $.ajax({
        type: "GET",
        url: "get_all_tags_for_poet/",
        data: {'id':id},
        dataType: "json",
    });
}

function create_dropdown(freqencyId , rangeId , clickfunction , array1 , array2){
       var src = document.getElementById(freqencyId);
       if (src.hasChildNodes()) {
          src.innerHTML = '';
       }
       array1.forEach(function(l){
              src.innerHTML += "<a href=\"javascript:void(0)\" onclick="+clickfunction+"(this,event,1)>"+l+"</a>"
        });
       src = document.getElementById(rangeId);
       if (src.hasChildNodes()) {
          src.innerHTML = '';
       }
       array2.forEach(function(l){
              src.innerHTML += "<a href=\"javascript:void(0)\" onclick="+clickfunction+"(this,event,2)>"+l+"</a>"
       });
}

// this function responsible for creating image of word cloud based on top k after receiving it from server.
function createWordCloud(obj, event,num){
    var el = obj.parentNode;
    el.style.display = "none";
    setTimeout(function() {
            el.style.removeProperty("display");
     }, 30);
    var src = document.getElementById("cloud");
    while (src.lastChild.id !== 'loader') {
        src.removeChild(src.lastChild);
    }
      document.getElementById("loader").style.display = "block";
      get_terms_freq(obj.innerText,num,currentPeriod).done(function(d){
      var delayInMilliseconds = 500;
      setTimeout(function() {
      //your code to be executed after 0.5 second
        d.t.forEach(function(part, index) {
          var num = part.freq*100
          part.freq = num.toFixed(2);
        });
        var chart = anychart.tagCloud(d.t);
        if (num == 1)
            chart.title('$ most frequent words'.replace('$',d.m));
        else {
            temp = obj.innerText.split("-")[0];
            temp = temp +'-'+d.m;
            chart.title('$ most frequent words'.replace('$',temp))
        }
      // set an array of angles at which the words will be laid out
        chart.angles([0]);
          // enable a color range
        chart.colorRange(true);
          // set the color range length
        chart.colorRange().length('80%');// display the word cloud chart
        chart.container("cloud");
        chart.tooltip().format("Frequency:{%value}\nPercent of Total:{%freq}%");
        chart.draw();
        document.getElementById("loader").style.display = "none";
        }, delayInMilliseconds);
      });

}

function createList(obj,event){
    var el = obj.parentNode;
    el.style.display = "none"
    setTimeout(function() {
            el.style.removeProperty("display");
     }, 30);
    table.clear().draw()
    document.getElementById("tablePageHeader").innerText = 'فترة $ '.replace('$',obj.innerText)
    document.getElementById("loader2").style.display = "block";
    get_terms_freq(" ",3,obj.id).done(function(d){
        data = d.t
        data.forEach(function(l , i){
             var percent = (l.freq*100).toFixed(2)+"%"
             table.row.add( [i+1,l.x,l.value,parseFloat(l.freq.toFixed(5)),percent]).draw()
         });
        document.getElementById("loader2").style.display = "none";
    });
}


function savePeriod(obj){
    var el = obj.parentNode;
    el.style.display = "none"
    setTimeout(function() {
            el.style.removeProperty("display");
     }, 30);
    var src = document.getElementById("periodbtn");
    src.value = obj.innerText
    currentPeriod = obj.innerText.toLowerCase();
    if(currentPeriod == "all periods"){
        create_dropdown("Frequency1","Range1","createWordCloud",frequency.reverse(),range)

    }else {
    get_max_freq(currentPeriod).done(function(d){
       array1 = Create_frequency_array(d.max)
       array2 = Create_range_array(d.max)
       create_dropdown("Frequency1","Range1","createWordCloud",array1,array2)
     });
     }

}

function get_tags_for_poet(obj){
    var el = obj.parentNode;
    el.style.display = "none"
    setTimeout(function() {
            el.style.removeProperty("display");
    }, 30);
    var src = document.getElementById("poetbtn");
    src.value = obj.innerText
    poet_id = obj.id
    table2.clear().draw()
    document.getElementById("ExcelDownload").style.display = "none";
    get_all_tags_for_poet(poet_id).done(function(d){
        data = d.tags
        Excel = []
        Excel.push(["#","Term","Frequency","Percent Of Total"])
        if (data.length > 0){
            document.getElementById("ExcelDownload").style.display = "block";
        }
        data.forEach(function(l , i){
             var percent = (l.Tag.frequency/d.total).toFixed(2)+"%"
             const r = [i+1,l.Tag.name,l.Tag.frequency,percent]
             table2.row.add(r).draw()
             Excel.push(r)
         });
    });
}

function filterFunction(dropDownId, inputId) {
    let input, filter, ul, li, a, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    let divv = document.getElementById(dropDownId);
    a = divv.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function ConvertToExcel(){
    if(typeof Excel === 'undefined') {
        return
     }
    const array = XLSX.utils.aoa_to_sheet(Excel)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, array, 'Tags Frequency')
    XLSX.writeFile(wb, 'Tags Frequency.xlsx')

}