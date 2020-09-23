
var followBtn = $('.js-btn-follow'),
    createBtn = $('.js-btn-create-user');

followBtn.on('click', function(e){
    e.preventDefault();
    var userid = $('.js-user-id').val(),
        followerNumber = $('.js-follwer-number').val();

    $.ajax({
        url: "/follow",
        type: "post",
        data: {
            user_id : userid,
            follower_number : followerNumber
        },
        success: function (response) {
            console.log(response);
            $('.js-user-id').val('');
            $('.js-follwer-number').val('');
            $('#success').fadeIn( 300 ).delay( 5000 ).fadeOut( 400 );
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            $('#error').fadeIn( 300 ).delay( 5000 ).fadeOut( 400 );

        }  
    });
});

createBtn.on('click', function(){
    var userNumber = $('.js-user-number').val();
    $.ajax({
        url: "/create",
        type: "post",
        data: {
            user_number : userNumber
        },
        success: function (response) {
            console.log(response);
            $('.js-user-number').val('');
            $('#success').fadeIn( 300 ).delay( 5000 ).fadeOut( 400 );
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            $('#error').fadeIn( 300 ).delay( 5000 ).fadeOut( 400 );
        }  
    });
});