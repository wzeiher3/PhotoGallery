'use strict';
const API_URL = "https://oghg2u4rx7.execute-api.us-east-1.amazonaws.com/dev";
const PHOTOGALLERY_S3_BUCKET_URL = "photobucket-zeiher-2021-4150";

function clearSession() {
    sessionStorage.clear();
    location.href='login.html';
};

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

function processLogin() {
    var username =  $("#username" ).val();
    var password = $("#password" ).val();

    var datadir = {
        username: username,
        password: password
    };

    $.ajax({
        url: `${API_URL}/login`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            var result = JSON.parse(data.body);
            console.log(result);
            if(result.result){
                sessionStorage.setItem('username', result.userdata.username);
                sessionStorage.setItem('name', result.userdata.name);
                sessionStorage.setItem('email', result.userdata.email);
                location.href='index.html';
            }else{
                $("#message").html(result.message);
            }
            
            console.log(data);
        },
        error: function(data) {
            console.log(data);
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    });    
}


function processSignup() {
    var username =  $("#username" ).val();
    var password = $("#password" ).val();
    var password1 = $("#password1" ).val();
    var name = $("#name" ).val();
    var email = $("#email" ).val();

    var datadir = {
        username: username,
        password: password,
        name: name,
        email: email
    };

    $.ajax({
        url: `${API_URL}/signup`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            var result = JSON.parse(data.body);
            console.log(result);
            $("#message").html(result.message);
            if(result.result){
                sessionStorage.setItem('username', result.userdata.username);
                $("#messageaction").html("Click  <a href=\"confirmemail.html\">here</a> to confirm your email");
            }
        },
        error: function() {
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    });    
}

function loadConfirmEmailPage(){
    var username = $("#username").val();
    var code = $("#code").val();

    var datadir = {
        username: username,
        code: code
    };

    $.ajax({
        url: `${API_URL}/confirmemail`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            var result = JSON.parse(data.body);
            console.log(result);
            if(result.result){                
                $("#confirmemail-message").html(result.message);
                $("#confirmemail-message-action").html("Click  <a href=\"login.html\">here</a> to login");                
            }else{
                $("#confirmemail-message").html(result.message);
            }
            
            console.log(data);
        },
        error: function(data) {
            console.log(data);
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    });  
}

function updatePhoto(){
    var photoID = $.urlParam('id');
    var title = $("#title").val();
    var description = $("#description").val();
    var tags = $("#tags").val();

    var datadir = {
        PhotoID: photoID,
        title: title,
        description: description,
        tags: tags
    }
    console.log(datadir);

    $.ajax({
        url: `${API_URL}/updatephoto`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {                        
            console.log("SUCCESS");
            location.href='index.html';            
        },
        error: function() {
            console.log("Failed");
            location.href='index.html';
        },        
        data: JSON.stringify(datadir)
    }); 
}


function deletePhoto(){
    var PhotoID= $.urlParam('id');
    // var contenttype = imageFile.type;
    console.log(PhotoID);

    var datadir = {
        PhotoID: PhotoID
    }

    $.ajax({
        url: `${API_URL}/deletephoto`,
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
            console.log('SUCCESS');
            console.log(data);
            location.href='index.html';
         },
        error: function(data){
            console.log('FAILED');
            console.log(data);
            
         },
        data: JSON.stringify(datadir)
    }); 

    console.log('END');
}


function uploadPhoto(){
    var title = $("#title").val();
    console.log(title);
    var description = $("#description").val();
    console.log(description);
    var tags = $("#tags").val();
    var imageFile = $('#imagefile')[0].files[0];
    var contenttype = imageFile.type;
    var filename=imageFile.name;
    console.log(imageFile);
    console.log(filename);

    $.ajax({
        url: `${API_URL}/uploadphoto/${filename}`,
        type: 'PUT',
        crossDomain: true,
        contentType: contenttype,
        processData: false,
        statusCode: {
        200: function(data) {
            console.log(data);
            console.log("Uploaded");
            processAddPhoto(filename, title, description, tags);
         }
        },       
        data: imageFile,
        error: function(data){
            console.log(data);
        }
    }); 
}

function processAddPhoto(filename, title, description, tags){
    var username = sessionStorage.getItem('username');    
    var uploadedFileURL = `https://${PHOTOGALLERY_S3_BUCKET_URL}.s3.amazonaws.com/photos/${filename}`;

    

    var datadir = {
        username: username,
        title: title,
        description: description,
        tags: tags,
        uploadedFileURL: uploadedFileURL
    };

    console.log(datadir);

    $.ajax({
        url: `${API_URL}/photos`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {                        
            console.log(data);
            location.href='index.html';            
        },
        error: function() {
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    }); 
}

function searchPhotos(){
    var query = $("#query").val();

    var datadir = {
        query: query
    };

    console.log(datadir);

    $.ajax({
        url: `${API_URL}/search`,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {                        
            console.log(data);
            sessionStorage.setItem('query', query);
            sessionStorage.setItem('searchdata', JSON.stringify(data));
            location.href='search.html';            
        },
        error: function() {
            console.log("Failed");
        },        
        data: JSON.stringify(datadir)
    }); 
}

function loadSearchPage(){
    var query = sessionStorage.getItem('query');
    var data = JSON.parse(sessionStorage.getItem('searchdata'));
    console.log(data);
    $("#searchquery-container").html("Showing search results for: "+query);
    var htmlstr="";
    $.each(data.body, function(index, value) {
        //console.log(value);
        htmlstr = htmlstr + '<div class=\"cbp-item idea web-design theme-portfolio-item-v2 theme-portfolio-item-xs\"> <div class=\"cbp-caption\"> <div class=\"cbp-caption-defaultWrap theme-portfolio-active-wrap\"> <img src=\"'+value.URL+'\" alt=\"\"> <div class=\"theme-icons-wrap theme-portfolio-lightbox\"> <a class=\"cbp-lightbox\" href=\"'+value.URL+'\" data-title=\"Portfolio\"> <i class=\"theme-icons theme-icons-white-bg theme-icons-sm radius-3 icon-focus\"></i> </a> </div> </div> </div> <div class=\"theme-portfolio-title-heading\"> <h4 class=\"theme-portfolio-title\"><a href=\"viewphoto.html?id='+value.PhotoID+'\">'+value.Title+'</a></h4> <span class=\"theme-portfolio-subtitle\">by '+value.Username+'<br>'+value.CreationTime+'</span> </div> </div>';
                });
        //console.log(htmlstr);
        $('#portfolio-4-col-grid-search').html(htmlstr);
        handlePortfolio4ColGridSearch();        
}



function handlePortfolio4ColGridSearch() {
        $('#portfolio-4-col-grid-search').cubeportfolio({
            filters: '#portfolio-4-col-grid-filter',
            layoutMode: 'grid',
            defaultFilter: '*',
            animationType: 'rotateRoom',
            gapHorizontal: 30,
            gapVertical: 30,
            gridAdjustment: 'responsive',
            mediaQueries: [{
                width: 1500,
                cols: 4
            }, {
                width: 1100,
                cols: 4
            }, {
                width: 800,
                cols: 4
            }, {
                width: 550,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            caption: ' ',
            displayType: 'bottomToTop',
            displayTypeSpeed: 100,

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        });
    }

function handlePortfolio4ColGrid() {
        $('#portfolio-4-col-grid').cubeportfolio({
            filters: '#portfolio-4-col-grid-filter',
            layoutMode: 'grid',
            defaultFilter: '*',
            animationType: 'rotateRoom',
            gapHorizontal: 30,
            gapVertical: 30,
            gridAdjustment: 'responsive',
            mediaQueries: [{
                width: 1500,
                cols: 4
            }, {
                width: 1100,
                cols: 4
            }, {
                width: 800,
                cols: 4
            }, {
                width: 550,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            caption: ' ',
            displayType: 'bottomToTop',
            displayTypeSpeed: 100,

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        });
    }

function checkIfLoggedIn(){
    var email = sessionStorage.getItem('email');
    var username = sessionStorage.getItem('username');
    if (email == null || username == null) {
            location.href='login.html';
    }
}

function loadHomePage(){
    checkIfLoggedIn();
    $("#userdata-container").html("Logged in as "+sessionStorage.getItem('name')+" ("+sessionStorage.getItem('username')+")");
    var datadir = {};
    var htmlstr="";
    $.ajax({
        url: `${API_URL}/photos`,
        type: 'GET',
        crossDomain: true,
        contentType: "application/json",
        success: function(data) {
            console.log(data);
            $.each(data.body, function(index, value) {
                //console.log(value);
                htmlstr = htmlstr + '<div class=\"cbp-item idea web-design theme-portfolio-item-v2 theme-portfolio-item-xs\"> <div class=\"cbp-caption\"> <div class=\"cbp-caption-defaultWrap theme-portfolio-active-wrap\"> <img src=\"'+value.URL+'\" alt=\"\"> <div class=\"theme-icons-wrap theme-portfolio-lightbox\"> <a class=\"cbp-lightbox\" href=\"'+value.URL+'\" data-title=\"Portfolio\"> <i class=\"theme-icons theme-icons-white-bg theme-icons-sm radius-3 icon-focus\"></i> </a> </div> </div> </div> <div class=\"theme-portfolio-title-heading\"> <h4 class=\"theme-portfolio-title\"><a href=\"viewphoto.html?id='+value.PhotoID+'\">'+value.Title+'</a></h4> <span class=\"theme-portfolio-subtitle\">by '+value.Username+'<br>'+value.CreationTime+'</span> </div> </div>';
                });
            console.log(htmlstr);
            $('#portfolio-4-col-grid').html(htmlstr);
            handlePortfolio4ColGrid();
            
        },
        error: function() {
            console.log("Failed");
        }
    });    
}

function loadAddPhotosPage(){
    checkIfLoggedIn();
    $("#userdata-container").html("Logged in as "+sessionStorage.getItem('name')+" ("+sessionStorage.getItem('username')+")");
}

function loadViewPhotoPage(){
    checkIfLoggedIn();
    $("#userdata-container").html("Logged in as "+sessionStorage.getItem('name')+" ("+sessionStorage.getItem('username')+")");
    console.log($.urlParam('id'));
    var PhotoID=$.urlParam('id');
    console.log(PhotoID);
    var htmlstr="";
    var tagstr="";
    $.ajax({
        url: `${API_URL}/photos/${PhotoID}`,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {            
            console.log(data);
            var photo=data.body[0];
            console.log(photo.URL);
            htmlstr = htmlstr + '<img class=\"img-responsive\" src=\"'+photo.URL+'\" alt=\"\"> <div class=\"blog-grid-content\"> <h2 class=\"blog-grid-title-lg\"><a class=\"blog-grid-title-link\" href=\"#\">'+photo.Title+'</a></h2> <p>By: '+photo.Username+'</p> <p id="uploadedID">Uploaded: '+photo.CreationTime+'</p> <p>'+photo.Description+'</p> </div>'
            // htmlstr = htmlstr + '<img class=\"img-responsive\" src=\"'+photo.URL+'\" alt=\"\"> <div class=\"blog-grid-content\"> <h2 class=\"blog-grid-title-lg\"><a class=\"blog-grid-title-link\" href=\"#\">'+photo.Title+'</a></h2> <form id="deletephotoform" enctype="multipart/form-data"><p>By: '+photo.Username+'</p> <p id="uploadedID">Uploaded: '+photo.CreationTime+'</p> <p>'+photo.Description+'</p> <button type="submit" class="btn-base-bg btn-base-sm radius-3" >Delete</button></form></div>'
            $('#viewphoto-container').html(htmlstr);
            var tags=photo.Tags.split(',');
            console.log(tags)
            $.each(tags, function(index, value) {
                tagstr=tagstr+'<li><a class=\"radius-50\" href=\"#\">'+value+'</a></li>';
            });
            $('#tags-container').html(tagstr);
        },
        error: function() {
            console.log("Failed");
        }
    });   
}

$(document).ready(function(){
    $("#loginform" ).submit(function(event) {
      processLogin();
      event.preventDefault();
    });

    $("#signupform" ).submit(function(event) {
      processSignup();
      event.preventDefault();
    });

    // $("#deletephotoform" ).submit(function(event) {
    //     alert('DELETED');
    //     deletePhoto();
    //     event.preventDefault();
    //   });

    $("#deleteBtn" ).click(function(event) {
        console.log(event)
        deletePhoto();
        event.preventDefault();
      });

      $("#updatephotoform").submit(function(event){
          updatePhoto();
          event.preventDefault();
      })

      $("#updateBtn").click(function(event) {
        console.log(event)
        // updatePhoto($.urlParam('id'));
        var photoID = $.urlParam('id')
        location.href=`updatephoto.html?id=${photoID}`;
        event.preventDefault();
      });

    $("#addphotoform" ).submit(function(event) {
      console.log(event)
      uploadPhoto();
      event.preventDefault();
    });

    $("#searchform" ).submit(function(event) {
      searchPhotos();
      event.preventDefault();
    });

    $("#confirmemail-form" ).submit(function(event) {
      loadConfirmEmailPage();
      event.preventDefault();
    });


    var pathname = window.location.pathname; 
    console.log(pathname);

    if(pathname=='/index.html' || pathname==='/'){
        loadHomePage();
    }else if(pathname=='/addphoto.html'){
        loadAddPhotosPage();
    }else if(pathname=="/viewphoto.html"){
        loadViewPhotoPage();
    }else if(pathname=="/search.html"){
        loadSearchPage();
    }else if(pathname=="/confirmemail.html"){
        var username =  sessionStorage.getItem('username');
        $("#username").val(username);        
    }


    $("#logoutlink" ).click(function(event) {
      clearSession();
      event.preventDefault();
    });

});
