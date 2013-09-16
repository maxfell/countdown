angular.module('CountdownsModule', ['ngTouch']);

moment.lang('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s:  "%d seconds",
        m:  "%d minute",
        mm: "%d minutes",
        h:  "%d hour",
        hh: "%d hours",
        d:  "%d day",
        dd: "%d days",
        M:  "%d month",
        MM: "%d months",
        y:  "%d year",
        yy: "%d years"
    }
});

moment.lang('en-type', {
    relativeTime : {
        future: "%s",
        past:   "%s",
        s:  "second",
        m:  "minute",
        mm: "minute",
        h:  "hour",
        hh: "hour",
        d:  "day",
        dd: "day",
        M:  "month",
        MM: "month",
        y:  "year",
        yy: "year"
    }
});

function Countdowns($scope, $log) {
  
  $scope.$log = $log
  
  if (localStorage["countdowns"] == undefined){
    $scope.countdowns = []
  }
  else{
    $scope.countdowns = JSON.parse(localStorage["countdowns"])
  }
  
  $scope.futureEventsFilter = function(el){
    return moment().isBefore(moment(el.date))
  }
  
  $scope.countdownDistance = function(el){
    distance = moment(el.date)
    distance.lang('en-type')
    return distance.fromNow()
   //dd 
  }
  
  $scope.deleteCountdown = function(el){
    
    del = confirm("Do you want to delete this countdown?")
    
    if (del==true){
      $scope.countdowns = $scope.countdowns.filter(function(el2){
        return el2 !== el
      })
      localStorage["countdowns"] = JSON.stringify($scope.countdowns);
    }
    
  }
  
  $scope.addAddCountdown = function(){
    if ($scope.showAddCountdown == true && $scope.addCountdownValid == null){
      
      $scope.addCountdownText = null
      $scope.showAddCountdown = false
      
      $scope.countdowns.push({
        "title" : $scope.addCountdownTitle,
        "date" : $scope.addCountdownDate
      })
      
      localStorage["countdowns"] = JSON.stringify($scope.countdowns);
    }
    else{
      alert("error!")
    }
  }
  $scope.changeAddCountdown = function(){
    //console.log(chrono.parse($scope.addCountdownText)[0].concordance)
    var parsedEvent = chrono.parse($scope.addCountdownText)[0]
    if (parsedEvent == undefined){
      
      $scope.showAddCountdown = false
      
      $scope.addCountdownTitle = $scope.addCountdownText
    }
    else{
      
      date = moment(parsedEvent.startDate)
      date.lang('en')
      
      $scope.showAddCountdown = true
      
      $scope.addCountdownTitle = parsedEvent.concordance.replace(/^ +/gm, '') || "Untitled Event"
      $scope.addCountdownDate = date.format()
      $scope.addCountdownDisplayDate = date.format('MMMM Do, h:mm a')
      
      $scope.addCountdownRemainingTime = date.fromNow(true)
      
      $scope.addCountdownValid = null
      
      if (moment().isAfter(date) == true) {
        $scope.addCountdownValid = "invalid"
        $scope.addCountdownRemainingTime = "-" + $scope.addCountdownRemainingTime
      }
    }
  }
}

countdownsModule = angular.module('CountdownsModule', []);
  // Register the 'myCurrentTime' directive factory method.
  // We inject $timeout and dateFilter service since the factory method is DI.
  countdownsModule.directive('timeFromNow', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
      var date,  // date format
          timeoutId; // timeoutId, so that we can cancel the time updates
      
      // used to update the UI
      
      
      function updateTime() {
        
        date = moment(attrs.timeFromNow)
        date.lang('en')
        
        if (moment().isAfter(date) == true) {
          element.text(date.fromNow(true) + " ago")
        }
        else{
          element.text(date.fromNow(true))
        }
      }
 
      // schedule update in one second
      function updateLater() {
        // save the timeoutId for canceling
        timeoutId = $timeout(function() {
          updateTime(); // update DOM
          updateLater(); // schedule another update
        }, 1000);
      }
 
      updateLater(); // kick off the UI update process.
    }
  });
  
  countdownsModule.directive('prettyTime', function($timeout, dateFilter) {
      return function(scope, element, attrs) {
          attrs.$observe('prettyTime',function(){
            date = moment(attrs.prettyTime)
              element.text(date.format('MMMM Do YYYY, h:mm a'))
          });
      }
  });