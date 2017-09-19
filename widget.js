$( function() {

  var dsv = d3.dsv(",", "text/plain"),
      availableDates,
      skypeAddress,
      name,
      time,
      phoneNumber,
      data,
      chosenDate

$('#skype-input').focus();

dsv('availability/availability.csv',function(csv) {
            data = csv;
            fillAvailability(data)
            });

   function fillAvailability(data) {
     sortedDates = []
     for(i = 0;i < data.length; i++) {
        sortedDates[i] = data[i].Date
     }
     availableDates = uniq(sortedDates);
     $("#datepicker").datepicker('option','beforeShowDay',unavailable);
    }

   function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
             })
      }

    function unavailable(date) {
        dmy = ('0' + date.getDate()).slice(-2) + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
        if ($.inArray(dmy, availableDates) == -1) {
            return [false, "", ""];
           } else {
            return [true, "unavailable-date",""];
           }
        }



$('#skypebt').on('click',function() {
     if (validateSkypeForm()) {
     $('#skype-progress-icon').attr('src','tick.svg')
              $("#tabs").tabs('enable',1);
              $("#tabs").tabs('option','active',1);
              $('#skype-address').text(skypeAddress);
              $('#name').text(name);
              $('#phone-number').text(phoneNumber);
              $('#email').text(email);
     }
     });

     function validateSkypeForm() {
         errorBox = $('#tab-1-error-box')
         errorBox.empty();
         skypeAddress = $('#skype-input').val();
         name = $('#name-input').val();
         phoneNumber = $('#phone-input').val();
         email = $('#email-input').val();
         emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
         fieldArr = skypeAddress.split('').concat(phoneNumber.split('')).concat(name.split(''))
         fbCh = ['/','\\','+',',',';']
         chClear = fieldArr.every(function(el,i) { return ($.inArray(el,fbCh) < 0) });
         if (!chClear) {
           errorBox.append("<p class='error-message'>Fields may not contain any of the charachters:  "
           + fbCh.join('  ')  + "</p>")
           return false;
         }
         if (skypeAddress.length < 1 || name.length < 1 || phoneNumber.length < 1 || email.length < 1) {
             errorBox.append("<p class='error-message'>Fields may not be empty.</p>")
             return false;
         }
         if ( ! (emailRegex.test(email))) {
             errorBox.append("<p class='error-message'>Please enter your full email address, e.g abc99@ic.ac.uk</p>")
             return false;
         }
         email = email.replace(/\s/g,'+')
         name = name.replace(/\s/g,'+')
         skypeAddress = skypeAddress.replace(/\s/g,'+')
         phoneNumber = phoneNumber.replace(/\s/g,'+')
         return true;
        }

     function updateTimeText(dateText) {
        chosenDate = $('#chosen-date').val();
        avTimes = data.filter(function(d) { return d.Date === chosenDate });
        timeSelector= $('#time-select');
        timeSelector.empty();
        for(i = 0;i < avTimes.length; i++)
             timeSelector.append('<option>' + avTimes[i].Time + '</option>')
        $('#date-progress-icon').attr('src','tick.svg')
        $('#date').text(chosenDate);
     }

     $('#timebt').on('click',function() {
        $('#time-progress-icon').attr('src','tick.svg')
        $("#tabs").tabs('enable',2);
        $("#tabs").tabs('option','active',2);
        time = $('#time-select').val()
        $('#time').text(time);
     });

    $('#final-confirm').on('click',function () {

    var queryString = '?name='  + name
                    + '&skype=' + skypeAddress
                    + '&date='  + chosenDate
                    + '&time='  + time
                    + '&email=' + email


    $('#confirm-progress-icon').attr('src','tick.svg');

    $('#hiddenFrame').attr('src','cgi-bin/confirmScript.cgi' + queryString)
    alert('Thank you, your booking has been submitted');


    //var formData = { 'Name': name,
    //                 'Phone-number': phoneNumber,
    //                 'Skype-address':skypeAddress,
    //                 'Date':chosenDate,
    //                 'Time':time }

        //$.ajax {     url: "confirmScript.py",
        //             data:formData,
        //             success:afterConfirm,
        //             error:errorConfirm
        //    }

    });

    // function afterConfirm()  {
    //    console.log("success")
    //}
    // function errorConfirm() {
    //    console.log("error")
    // }


    $( "#tabs" ).tabs({
        active : 0,
        disabled:[1,2]
    });

    $( "#datepicker" ).datepicker({
        defaultDate: "+1m 7d",
        minDate: 1,
        changeMonth:true,
        changeYear:true,
        altField: "#chosen-date",
        altFormat: "dd-mm-yy",
        onSelect: updateTimeText
    });

    $('#hiddenFrame').load(function(){
    location.reload();
      });

});






