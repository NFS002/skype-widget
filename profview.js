var links = {},
    avTable,
    dialog,
    bookingsTable,
    bookingsData,
    saveErr,
    avCsv = "",
    i;

$( function() {

$( "#tabs" ).tabs();

dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      position: { my: "center center", at: "center top" },
      resizable:false,
      modal: true,
    });

var dsv = d3.dsv(",", "text/plain")
dsv('availability/bookings.csv',function(data) {
bookingsTable = $('#bookingsTbody');
bookingsData = data;

for (i = 0; i < data.length; i++ ) {

chosenDate = data[i].Date;
time = data[i].Time;
name = data[i].Name;
skypeAddress = data[i].Skype;
email = data[i].Email



icons = "<td><a onclick='cancelClicked(" + i + ");' class = 'cancel icon mini-icon' >&times;</a>"
+ "<a onclick = 'recycleClicked(" + i + ");' class = 'refresh icon mini-icon' >&#9853;</a></td>"


    $('<tr/>').appendTo(bookingsTable).append('<td>' + chosenDate + '</td>')
                              .append('<td>' + time + '</td>')
                              .append('<td>' + name + '</td>')
                              .append('<td>' + skypeAddress + '</td>')
                              .append('<td>' + email + '</td>')
                              .append(icons);

        }
        if (data.length < 1) $('#eotOne').text('You have no Bookings')
        if (data.length > 7) $('#eotOne').text('Scroll down to see more')

  });



function fillAvailbilityTable() {

    avTable = $('#availibilityTbody')

    dsv('availability/availability.csv',function(csv){
        for (i = 0; i<csv.length;i++) {
        avDate = csv[i].Date;
        avTime = csv[i].Time;
            $("<tr id = avRow" + i + "></tr>").appendTo(avTable)
                      .append('<td><input type=text  value=' + avDate  + '></td>')
                      .append('<td><input type=text  value=' + avTime  + '></td>')
                      .append('<td></td>')
                      .append('<td></td>')
                      .append("<td class='cancel icon mini-icon' onClick = 'deleteAvRow(" + i + ")'>&times;</td>")


           }
           if (csv.length < 1) $('#eotTwo').text('You have no marked available dates')
           if (csv.length > 7) $('#eotTwo').text('Scroll down to see more')
     });

};

fillAvailbilityTable();


$('#newRowBt').on('click',function() {

i++

$('<tr id = avRow' + i + '></tr>').prependTo(avTable)
              .append('<td><input placeholder="dd-mm-yyy" type=text ></td>')
              .append('<td><input placeholder="hh:mm" type=text ></td>')
              .append('<td></td>')
              .append('<td></td>')
              .append("<td class = 'cancel icon mini-icon' onClick = 'deleteAvRow(" + i + ")'>&times;</td>")

window.location = "#tableContainer"

$('#avRow' + i).addClass('green',function(){
    $(this).removeClass('green')
  });


editAvRow(i);

 })

$('#savebt').on('click',function savebt(){
   fbCh = ['/','\\','+',',',';']
   function noErr(el,i) { return ($.inArray(el,fbCh) < 0) }

   $('#availibilityTbody input').each(function(i,el) {
    valArr = $(this).val().split('')
    chClear = valArr.every(noErr);
    if (valArr.length > 4 && chClear) {
        avCsv += $(this).val() + ','
        if (i % 2 !== 0)
            avCsv = avCsv.slice(0,-1) +  '\n'
    }
    else {
    saveErr = true
    }

    });

    if (saveErr) {
    alert('Could not save. fields cannot be empty or contain special characters: ' + fbCh.join(' ') )
    saveErr = false;
    avCsv = '';
    return;
    }
    form = $("<form></form>")
            .attr('action','cgi-bin/editAv.cgi')
            .attr('method','POST')
            .attr('target','hiddenFrameTwo')

         $('<textarea></textarea>')
              .attr('name','csv')
              .text(avCsv)
              .css('display','none')
              .appendTo(form)

         $('body').append(form);

         form.submit();

        avCsv = ''

});


$('#hiddenFrame').load(function(){
    alert('Thank you, your changes have been saved')
    location.reload();
    })


});



function cancelClicked(i) {
    dialog.dialog( "option", "title", "Cancel the booking" );
    dialog.dialog( "open" );
    $('#crbt').on('click',function(){
        bookingsData[i].emailComments = $('#emailComments').val();
        if (bookingsData[i].emailComments.length > 1)
              bookingsData[i].emailComments = 'We apologise for any inconvenience caused'
        form = createBookingsForm(i,'Cancel')
        $(document.body).append(form)
        form.submit();
        dialog.dialog('close')
    });
}

function recycleClicked(i) {
    dialog.dialog( "option", "title", "Recycle the booking" );
        dialog.dialog( "open" );
        $('#crbt').on('click',function(){
            bookingsData[i].emailComments = $('#emailComments').val();
            if (bookingsData[i].emailComments.length > 1)
                bookingsData[i].emailComments = 'We apologise for any inconvenience caused'
            form = createBookingsForm(i,'Refresh')
            $(document.body).append(form)
            form.submit();
            dialog.dialog('close')
   });
}

function createBookingsForm(i,mode) {
    form = $('</form><form>')
           .attr('action','cgi-bin/prof' + mode + '.cgi')
           .attr('method','POST')
           .attr('target','hiddenFrame')

    $('<input></input>')
            .attr('type','text')
            .attr('name','name')
            .val(bookingsData[i].Name)
            .css('display','none')
            .appendTo(form)

     $('<input></input>')
                .attr('type','text')
                .attr('name','skype')
                .val(bookingsData[i].Skype)
                .css('display','none')
                .appendTo(form)

     $('<input></input>')
                  .attr('type','text')
                  .attr('name','date')
                  .val(bookingsData[i].Date)
                  .css('display','none')
                  .appendTo(form)

     $('<input></input>')
                     .attr('type','text')
                     .attr('name','time')
                     .val(bookingsData[i].Time)
                     .css('display','none')
                     .appendTo(form)

     $('<input></input>')
                       .attr('type','text')
                       .attr('name','email')
                       .val(bookingsData[i].Email)
                       .css('display','none')
                       .appendTo(form)

     $('<input></input>')
                        .attr('type','text')
                        .attr('name','comments')
                        .val(bookingsData[i].emailComments)
                        .css('display','none')
                        .appendTo(form)

     $('body').append(form)


    return form
}

function editAvRow(i) {
$('#avRow' + i + " input")
        .removeAttr('readonly')
        .first().focus()
}

function deleteAvRow(i) {
$('#avRow' + i ).css('background-color','rgba(255, 0, 0, 0.3)')
$('#avRow' + i ).fadeOut('slow',function() {

    $('#avRow' + i ).remove();
    })

 }