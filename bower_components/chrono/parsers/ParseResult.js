/*
  Parser, is base object of every chrono parser. The parser must provides these following method  
  
  DateCompoents {
    
    @attribute {Integer} year
    @attribute {Integer} month
    @attribute {Integer} day
    @attribute {Integer} hour
    @attribute {Integer} minute
    @attribute {Integer} second
    
    @method { Date } date 
    
    @attribute { Array<String> } impliedComponents
  }
  
  ParseResult {
    
    @attribute {DateCompoents} start
    @attribute {Date} startDate
    
    @attribute {DateCompoents, Optional} end
    @attribute {Date, Optional} endDate
    
    
    @attribute { Date } referenceDate
    @attribute { Integer } index
    @attribute { String } text
    @attribute { String } sentence
    @attribute { Number, Optional} timezoneOffset 
  }
  
*/

(function () {
  
  if(typeof chrono == 'undefined')
    throw 'Cannot find the chrono main module';
  
  function DateComponents(components) {
    this.year = components.year;
    this.month = components.month;
    this.day = components.day;
    this.hour = components.hour;
    this.minute = components.minute;
    this.second = components.second;
    this.timezoneOffset = components.timezoneOffset;
    this.dayOfWeek = components.dayOfWeek;
    
    if(components.meridiem)
      this.meridiem = components.meridiem.toLowerCase(); // am/pm
    
    if(components.impliedComponents && components.impliedComponents.length > 0){
      this.impliedComponents = components.impliedComponents
    }
    
    this.isCertain = function(component) {
      return (this[component] !== undefined && this[component] !== null) 
        && (this.impliedComponents ? this.impliedComponents.indexOf(component) < 0 : true);
    }
    
    this.date = function(timezoneOffset) { 
      
      if(this.timezoneOffset === undefined || this.timezoneOffset === null){
        if(timezoneOffset === undefined || timezoneOffset === null)
          timezoneOffset = new Date().getTimezoneOffset()
      }else{
        timezoneOffset = this.timezoneOffset;
      }
      
      var dateMoment = moment(new Date(this.year,this.month,this.day));
      
      //If there is only date representation, move the represent time to 12 AM
      if(this.hour === undefined || this.hour === null) dateMoment.hours(12);
      else dateMoment.hours(this.hour);
      
      dateMoment.minutes(this.minute);
      dateMoment.seconds(this.second);

      dateMoment.add('minutes', timezoneOffset - new Date().getTimezoneOffset());
      //console.log(timezoneOffset)
      return dateMoment.toDate();
    }
  }
  
  function ParseResult(result){
    
    this.start = new DateComponents(result.start)
    this.startDate = this.start.date();
    
    if(result.end){
      this.end = new DateComponents(result.end)
      this.endDate = this.end.date();
    }
    
    this.referenceDate = result.referenceDate;
    this.index = result.index;
    this.text = result.text;
    this.concordance = result.concordance;
    
    if(result.timezoneOffset){
     this.timezoneOffset = result.timezoneOffset;
    }
    
  }
  
  chrono.DateComponents = DateComponents;
  chrono.ParseResult = ParseResult;
})();


