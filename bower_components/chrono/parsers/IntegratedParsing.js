/*
  
*/

(function () {
  
  if(typeof chrono == 'undefined')
    throw 'Cannot find the chrono main module';
  
  function integratedParse(text, ref, opt, parserTypes){
    
    opt = opt || {};
    ref = ref || new Date();
    parserTypes = parserTypes || Object.keys(chrono.parsers);
    
    var currentParserIndex = 0;
    var parsers = [];
    var results = [];
    
    //Initialize The Parsers
    for(var i=0; i<parserTypes.length;i++){
      if(chrono.parsers[parserTypes[i]])
      parsers.push(new chrono.parsers[parserTypes[i]] (text, ref, opt) );
    }
    
    while(currentParserIndex < parsers.length){
      
      var currenParser = parsers[currentParserIndex];
      
      while(!currenParser.finished()){
        var result = currenParser.exec();
        if(result) insertNewResult(results, result);
      }
      currentParserIndex++;
    }
    return results;
  }
  
  function insertNewResult(results, newResult){
    //Find the place in the array that this result is belong to
    // Change to binary search later.
    var index = 0;
    while(index < results.length && results[index].index < newResult.index) index++;

    if(index < results.length){

      //Checking conflict with other results on the RIGHT side
      var overlapped_index = index;
      while(overlapped_index < results.length && 
        results[overlapped_index].index < newResult.index + newResult.text.length){
        
        //Comapare length
        // If old value is longer, discard the newResult. 
        // SKIP the remaining operation
        if(results[overlapped_index].text.length >= newResult.text.length) return results;
        
        overlapped_index++;
      }

      results.splice(index,overlapped_index-index);
    }

    if(index-1 >= 0){
    
      //Checking conflict with other results on the LEFT side
      var oldResult = results[index-1];
      if(newResult.index < (oldResult.index + oldResult.text.length)){
        
        //Comapare length
        // If old value is longer, discard the newResult.
        // If new value is longer, discard the oldResult.
        if( oldResult.text.length >= newResult.text.length) return results;
        else{
          results.splice(index-1,1);
          index = index-1;
        }
      }
    }

    results.splice(index,0,newResult);
    return results;
  }
  
  chrono.integratedParse = integratedParse;
})();

