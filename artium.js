$(document).ready(function() {
    var playlists = [];
    var ser;
    currentListName = "";
    currentListPicUrl = "";
    allSongsUrl = [];
    allSongsNames = [];
    allData = [];
    dataPlayList = {};
    target = "";
    editMode = false;
    originalSongsInputs = "";
    originalPlayListsInputs = "";

    showAll();


    // first request from the api //
    function showAll() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8888/playList/api.php/?type=playlist',
            success: function(data) {
                console.log('success', data);
                playlists = data.data;

                // create all playlists discs // 
                for (i = 0; i < playlists.length; i++) {
                    $('.main-row').append('<div id=' + playlists[i].id + ' class="col-sm-3 main-pic"></div>');
                    $('#' + playlists[i].id).append('<h4 id="header' + playlists[i].id + '">' + playlists[i].name + '</h4>');
                    $('#' + playlists[i].id).append('<img src="' + playlists[i].image + '" class="img-responsive img-circle" style="display:inline;">')
                    $('#' + playlists[i].id).append('<div class="play" onclick="playFunction(' + playlists[i].id + ')"><a href="#"><i class="fa fa-play fa-lg"></i></a></div>');
                    $('#' + playlists[i].id).append('<div class="delete" onclick="deleteFunction(' + playlists[i].id + ')"><a href="#"><i class="fa fa-remove fa-lg"></i></a></div>');
                    $('#' + playlists[i].id).append('<div class="edit" onclick="editFunction(' + playlists[i].id + ')"><a href="#"><i class="fa fa-pencil fa-lg"></i></a></div>');

                    new CircleType(document.getElementById('header' + playlists[i].id)).radius(100);
                }
                // end playlist discs //
            }
        });

    }
    // end first request from api //
});


// validations //
var regexUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
var regexMp3Url = "^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?.mp3$"
$('.urlSongs').attr('pattern', regexMp3Url);

function checkName() {
    if ($('input[name="listName"]').val().length < 3) {
        if (!$('.listNameInput > p').hasClass('validation')) {
            $('input[name="listName"]').css('border-color', 'red');
            $("<p class='validation listName' style='color: red;'> 3 letters to more </p>").insertAfter("input[name='listName']");
        } else {

        }
    } else {
        $('input[name="listName"]').css('border-color', '');
        $('.listName').remove();
        return true;
    }
}

function checkUrl() {
    if (!$('input[name="listUrlImg"]').val().match(regexUrl)) {
        if (!$('.listUrlInput > p').hasClass('validation')) {
            $('.imagePre').css('display', 'none');
            $('input[name="listUrlImg"]').css('border-color', 'red');
            $('.listUrlInput').append(`<p class="validation listUrl" style="color: red;">incorrect Url input</p>`);
        } else {

        }
    } else {
        $('input[name="listUrlImg"]').css('border-color', '');
        $('.listUrl').remove();
        $('.imagePre').attr('src', $('input[name=listUrlImg]').val());
        $('.imagePre').css('display', 'block');
        return true;
    }
}
// end validation //



// get data from the first form // 
$('#formList').submit(function(e) {
    if (checkUrl() == true && checkName() == true) {
        currentListName = $('input[name=listName]').val();
        currentListPicUrl = $('input[name=listUrlImg]').val();

        $('#addNewPlayList').modal('hide');
        // Load up a new modal...
        if (editMode == true) {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8888/playList/api.php/?id=' + target,
                success: function(data) {
                    originalSongsInputs = $('.songsInputs').html();
                    $('.songsInputs').html(" ");
                    songsArray = data.data.songs
                    songsArray.forEach(function(elem, index){
                        $('.songsInputs').append('<div class="col-sm-6">Song Url:<input value="'+elem.url+'" class="urlSongs" name="songUrl'+index+'" required type="text"></div><div class="col-sm-6">Name:<input name="song'+index+'" value="'+elem.name+'" required type="text"></div>') 
                    });
                    $('#addSongs').modal();
                }
            });
        }else{
            $('#addSongs').modal();
        }

    } else {
        checkName();
        checkUrl();
    }

    e.preventDefault();
});
// end get data from the first form //


// get data from second form //
$('#songsForm').submit(function(e) {
    ser = $(this).serializeArray();
    ser.forEach(function(elem, index) {
        if (index % 2 == 0) {
            allSongsUrl.push(elem.value);
        } else {
            allSongsNames.push(elem.value);
        }
    });
    for (i = 0; i < allSongsUrl.length; i++) {
        allData.push({ name: allSongsNames[i], url: allSongsUrl[i] })
    }
    console.log(allData);
    dataPlayList = {
        name: currentListName,
        image: currentListPicUrl,
        songs: allData
    }
    $('#addSongs').modal('hide');
    if(editMode = true){
        alert("hello");
    }else{
        postPlayList()
    }
    e.preventDefault();
});
// end get data from second form//


// add song input // 
$('#addSongInput').on('click', function() {
    inputs = $('.urlSongs').length + 1;
    console.log(inputs);
    $('.songsInputs').append('<div class="col-sm-6">Song Url:<input class="urlSongs" name="songUrl' + inputs + '" required type="text"></div><div class="col-sm-6">Name:<input name="song' + inputs + '" required type="text"></div>');
});
// end add song input //


// post Play List //
function postPlayList() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8888/playList/api.php/?type=playlist',
        data: dataPlayList,
        success: function(newPlayList) {
            newId = newPlayList.data.id

            $('.main-row').append('<div id=' + newId + ' class="col-sm-3 main-pic"></div>');
            $('#' + newId).append('<h4 id="header' + newId + '">' + dataPlayList.name + '</h4>');
            $('#' + newId).append('<img src="' + dataPlayList.image + '" class="img-responsive img-circle" style="display:inline;">')
            $('#' + newId).append('<div class="play" onclick="playFunction(' + newId + ')"><a href="#"><i class="fa fa-play fa-lg"></i></a></div>');
            $('#' + newId).append('<div class="delete" onclick="deleteFunction(' + newId + ')"><a href="#"><i class="fa fa-remove fa-lg"></i></a></div>');
            $('#' + newId).append('<div class="edit" onclick="editFunction(' + newId + ')"><a href="#"><i class="fa fa-pencil fa-lg"></i></a></div>');

            new CircleType(document.getElementById('header' + newId)).radius(100);
        }
    });
}
// end post Play List //


// edit playList // 
function editFunction(x) {
    editMode = true;
    target = x;
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8888/playList/api.php/?type=playlist&&id=' + x,
        success: function(data) {
            $('input[name=listName]').val(data.data.name);
            $('input[name=listUrlImg]').val(data.data.image);
            checkName();
            checkUrl();
        }
    });

    $('#addNewPlayList').modal();

}
// end edit playList //

fucntion updateFunction(){

}


// delete playList // 
function deleteFunction(x) {
    target = x;
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8888/playList/api.php/?type=playlist&&id=' + x,
        success: function(data) {
            $('.delete-modal').html("are you sure you want to delete " + data.data.name + " playList?");
            $('#deletePlayList').modal();
        }
    });
};

$('#formDeleteList').submit(function(e) {
    $.ajax({
        url: 'http://api.local/api/playlist/?type=playlist&&id=1,
        type: 'DELETE',
        success: function(result) {
            $('#deletePlayList').modal('hide');
            $('#' + target).remove();
        }
    });
    e.preventDefault();
});
// end delete play // 


// play playlist //
function playFunction(x) {
    console.log(x);
}
// end play playlist //
