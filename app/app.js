var myAngularApp = angular.module('myAngularApp', ['ngAnimate']);

myAngularApp.controller('Controller', ['$scope', '$interval', function($scope, $interval){
  $scope.ActiveButton = "HomeButton";
  document.getElementById('HomeButton').focus();

  $scope.quotes = [
    {text: "\"It is not enough for code to work.\"", author: "-Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship"},
    {text: "\"So if you want to go fast, if you want to get done quickly, if you want your code to be easy to write, make it easy to read.\"", author: "-Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship"},
    {text: "\"Clean code is not written by following a set of rules. You don't become a software craftsman by learning a list of heuristics. Professionalism and craftsmanship come from values that drive disciplines.\"", author: "-Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship"}
  ];
  $scope.currentQuoteIndex = 0;
  $scope.currentQuote = $scope.quotes[$scope.currentQuoteIndex];

  var today = new Date();
  $scope.paychecks = [
    {name: 'John', amount: 100, frequency: 'Bi-Weekly', nextPayDate: today, nextPayDateForecast: today},
    {name: 'Jane', amount: 200, frequency: 'Weekly', nextPayDate: today, nextPayDateForecast: today}
  ];
  $scope.bills = [
    {name: 'Electric', frequency: 'Monthly', nextDueDate: today, nextDueDateForecast: today, amount: 100},
    {name: 'Water', frequency: 'Monthly', nextDueDate: today, nextDueDateForecast: today, amount: 25}
  ];
  $scope.nextYearForecast = [];

  $interval(
    function(){
      if($scope.ActiveButton == "HomeButton"){$scope.quoteHide = true;}
    }, 10000);
  $interval(
    function(){
      if($scope.ActiveButton == "HomeButton"){
        if($scope.currentQuoteIndex >= $scope.quotes.length -1){$scope.currentQuoteIndex = 0}
        else{$scope.currentQuoteIndex++;}
        $scope.currentQuote = $scope.quotes[$scope.currentQuoteIndex];
      }
    }, 10000);
  $interval(
    function(){
      if($scope.ActiveButton == "HomeButton"){$scope.quoteHide = false;}
    }, 10000);

  $scope.addPaycheck = function(){
    $scope.paychecks.push({
      name: $scope.newPaycheck.name,
      amount: parseFloat($scope.newPaycheck.amount),
      frequency: $scope.newPaycheck.frequency,
      nextPayDate: $scope.newPaycheck.nextPayDate,
      nextPayDateForecast: new Date($scope.newPaycheck.nextPayDate)
    });
    $scope.newPaycheck.name = "";
    $scope.newPaycheck.amount = "";
    $scope.newPaycheck.frequency = "";
    $scope.newPaycheck.nextPayDate = "";
    $scope.AddPaycheck.$setUntouched();
    $scope.AddPaycheck.$setPristine();
  }

  $scope.editPaycheck = function(paycheck){
    $scope.newPaycheck = {};
    $scope.newPaycheck.name = String(paycheck.name);
    $scope.newPaycheck.amount = Number(paycheck.amount);
    $scope.newPaycheck.frequency = String(paycheck.frequency);
    $scope.newPaycheck.nextPayDate = new Date(paycheck.nextPayDate);
    $scope.removePaycheck(paycheck);
  }

  $scope.removePaycheck = function(paycheck){
    var removedPaycheck = $scope.paychecks.indexOf(paycheck);
    $scope.paychecks.splice(removedPaycheck, 1);
  }

  $scope.addBill = function(){
    $scope.bills.push({
      name: $scope.newBill.name,
      frequency: $scope.newBill.frequency,
      nextDueDate: $scope.newBill.nextDueDate,
      nextDueDateForecast: new Date($scope.newBill.nextDueDate),
      amount: parseFloat($scope.newBill.amount)
    });
    $scope.newBill.name = "";
    $scope.newBill.amount = "";
    $scope.newBill.frequency = "";
    $scope.newBill.nextDueDate = "";
    $scope.AddBill.$setUntouched();
    $scope.AddBill.$setPristine();
  }

  $scope.editBill = function(bill){
    $scope.newBill = {};
    $scope.newBill.name = String(bill.name);
    $scope.newBill.amount = Number(bill.amount);
    $scope.newBill.frequency = String(bill.frequency);
    $scope.newBill.nextDueDate = new Date(bill.nextDueDate);
    $scope.removeBill(bill);
  }

  $scope.removeBill = function(bill){
    var removedBill = $scope.bills.indexOf(bill);
    $scope.bills.splice(removedBill, 1);
  }

  $scope.addRecordNextYearForecast = function($forecastRowName,$currentPeriodStartDate,$periodStartBalance,$periodEndBalance,$deductions){
    $scope.nextYearForecast.push({
      name: $forecastRowName,
      startDate: $currentPeriodStartDate,
      startBalance: $periodStartBalance,
      endBalance: $periodEndBalance,
      deductions: $deductions
    });
  }

  $scope.forecastNextYear = function(){
    $scope.resetNextYearForecast();
    var oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    var currentPeriodStartDate = new Date();
    var periodEndBalance = $scope.startingBalance.amount;

    while (currentPeriodStartDate.getTime() < oneYearLater.getTime()){
      var periodStartBalance = periodEndBalance;
      var currentPeriodStartDate = new Date($scope.paychecks[0].nextPayDateForecast);
      var forecastRowName = "";
      var nextPeriodStartDate = $scope.paychecks[0].nextPayDateForecast;
      var deductions = "";

      for (var paycheck in $scope.paychecks){
          if(currentPeriodStartDate.getTime() > $scope.paychecks[paycheck].nextPayDateForecast.getTime()){
            currentPeriodStartDate = new Date($scope.paychecks[paycheck].nextPayDateForecast);
          }
      }

      for (var paycheck in $scope.paychecks){
        if(currentPeriodStartDate.getTime() === $scope.paychecks[paycheck].nextPayDateForecast.getTime()){
          periodStartBalance = periodStartBalance + $scope.paychecks[paycheck].amount;
          $scope.updateNextPayDateForecast(paycheck);
          forecastRowName = $scope.appendBudgetForecastRowString(forecastRowName, String($scope.paychecks[paycheck].name));
        }
      }
      periodEndBalance = periodStartBalance;

      for (var paycheck in $scope.paychecks){
          if($scope.paychecks[paycheck].nextPayDateForecast.getTime() <= nextPeriodStartDate.getTime()){
            nextPeriodStartDate = $scope.paychecks[paycheck].nextPayDateForecast;
          }
      }

      for (var bill in $scope.bills){
        while(nextPeriodStartDate.getTime() > $scope.bills[bill].nextDueDateForecast.getTime()){
          periodEndBalance = periodEndBalance - $scope.bills[bill].amount;
          $scope.updateNextBillDueDateForecast(bill);
          deductions = $scope.appendBudgetForecastRowString(deductions, String($scope.bills[bill].name));
        }
      }
      periodEndBalance = periodEndBalance - $scope.spendingMoney.amount;
      deductions = $scope.appendBudgetForecastRowString(deductions, "Spending Money");

      $scope.addRecordNextYearForecast(forecastRowName,new Date(currentPeriodStartDate),periodStartBalance,periodEndBalance,deductions);
    }
  }

  $scope.updateNextPayDateForecast = function(paycheck){
    switch(String($scope.paychecks[paycheck].frequency)){
      case "Bi-Weekly" : $scope.paychecks[paycheck].nextPayDateForecast.setDate($scope.paychecks[paycheck].nextPayDateForecast.getDate() + 14); break;
      case "Weekly" : $scope.paychecks[paycheck].nextPayDateForecast.setDate($scope.paychecks[paycheck].nextPayDateForecast.getDate() + 7); break;
      case "Semi-Monthly" :
        if($scope.paychecks[paycheck].nextPayDateForecast.getDate() == 1){
          $scope.paychecks[paycheck].nextPayDateForecast.setDate(15);
        }
        else{
          $scope.paychecks[paycheck].nextPayDateForecast.setDate(1);
          if($scope.paychecks[paycheck].nextPayDateForecast.getMonth() <12){
            $scope.paychecks[paycheck].nextPayDateForecast.setMonth($scope.paychecks[paycheck].nextPayDateForecast.getMonth() + 1);
          }
          else{
            $scope.paychecks[paycheck].nextPayDateForecast.setMonth(1);
            $scope.paychecks[paycheck].nextPayDateForecast.setFullYear($scope.paychecks[paycheck].nextPayDateForecast.getFullYear() + 1);
          }
        }
        break;
      case "Monthly" : $scope.paychecks[paycheck].nextPayDateForecast.setMonth($scope.paychecks[paycheck].nextPayDateForecast.getMonth() + 1); break;
    }
  }

  $scope.updateNextBillDueDateForecast = function(bill){
    switch(String($scope.bills[bill].frequency)){
      case "Bi-Weekly" : $scope.bills[bill].nextDueDateForecast.setDate($scope.bills[bill].nextDueDateForecast.getDate() + 14); break;
      case "Weekly" : $scope.bills[bill].nextDueDateForecast.setDate($scope.bills[bill].nextDueDateForecast.getDate() + 7); break;
      case "Monthly" : $scope.bills[bill].nextDueDateForecast.setMonth($scope.bills[bill].nextDueDateForecast.getMonth() + 1); break;
    }
  }

  $scope.resetNextYearForecast = function(){
    $scope.nextYearForecast = [];
    for (var paycheck in $scope.paychecks){$scope.paychecks[paycheck].nextPayDateForecast = new Date($scope.paychecks[paycheck].nextPayDate);}
    for (var bill in $scope.bills){$scope.bills[bill].nextDueDateForecast = new Date($scope.bills[bill].nextDueDate);}
  }

  $scope.appendBudgetForecastRowString = function(rowItemToAppend, rowInfoToAppend){
    if(String(rowItemToAppend) === ""){return rowInfoToAppend;}
    else{return rowItemToAppend + ", " + rowInfoToAppend;}
  }

  $scope.convertArrayOfObjectsToCSV = function(arrayOfObjects) {
      var result, keys, data;
      data = arrayOfObjects || null;
      if (data == null || !data.length) {return null;}

      keys = Object.keys(data[0]);
      keys.pop();
      result = '';
      result += keys.join(',');
      result += "\n";

      data.forEach(function(obj){
        keys.forEach(function(key, index){
            if (index) result += '","';
            else{result += '"';}
            if(null != obj[key] && !isNaN(obj[key]) && ("undefined" !== typeof obj[key].getDate)){result += obj[key].toLocaleDateString();}
            else{result += obj[key];}
        });
        result += '"' + "\n";
      });
      return result;
  }

  $scope.downloadCSV = function() {
      var data, filename, link;
      var csv = $scope.convertArrayOfObjectsToCSV($scope.nextYearForecast);
      if (csv == null) return;
      filename = "BudgetForecast.csv";

      if (!csv.match(/^data:text\/csv/i)) {csv = 'data:text/csv;charset=utf-8,' + csv;}
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
  }
}]);
