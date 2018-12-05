(function(window, angular, undefined) {
  "use strict";

  /**
   * Home/ERU Survey view controller.
   *
   * @namespace Controllers
   * @class homeCtrl
   */
  angular
    .module("erusurvey.controllers.homeCtrl", [
      'erusurvey.services.userInfoService',
      'erusurvey.services.trackFactory'
    ])
    .controller("homeCtrl", [
      "userInfoService",
      "trackFactory",
      "config",
      function(
        userInfoService,
        trackFactory,
        config
      ) {
        var userInfo;
        var self = this;

        self.isMemberHasTeleHealth = true;
        self.isMemberHasHealthLineBlue = true;
        self.isMemberHasMdLive = true;
        self.isMemberHasTelaDoc = true;
        self.isMemberHasFullyInsuredGroupPolicy = true;
        self.isMemberHasASOPolicy = true;

        self.firstQPage = false;
        self.secondQPage = false;
        self.thirdQPage = false;
        self.fourthQPage = false;
        self.teleHealthPage = false;
        self.healthLineBluePage = false;
        self.rewardPage = true;
        self.surveyConfirmation = false;
        self.printCustomizedGuide = false;
        self.hideSubmitBtn = false;
        self.formError = false;

        
        /*
        * Get userinfo here
        */
        userInfoService.getUserInfo()
          .then(function(response) {
            userInfo = response;
            self.isMemberHasTeleHealth = userInfo.telehealth === "true" ? true : false;
            self.isMemberHasHealthLineBlue = userInfo.healthLineBlue === "true" ? true : false;
            self.isMemberHasMdLive = userInfo.mdLive === "true" ? true : false;
            self.isMemberHasTelaDoc = userInfo.telaDoc === "true" ? true : false;
            self.isMemberHasFullyInsuredGroupPolicy = userInfo.fullyInsuredGroup === "true" ? true : false;
            self.isMemberHasASOPolicy = userInfo.aso === "true" ? true : false;
          }, function(error) {
            console.log('error- ', error);
          });

        
        /*
        * 1st Question
        */
        self.showAnsweredCorrectly = false;
        self.showAnsweredInCorrectly = false;
        self.firstAnswers = [];
        self.insertFirstAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.firstAnswers.push(val);
          } else {
            self.firstAnswers.pop();
          }
          
          self.handleFirstAnswersConditions();
        };

        self.submitFirstAnswer = function(e) {
          e.preventDefault();
          if (self.firstAnswers.length === 0) {
            self.formError = true;
            return true;
          }
          
          self.hideSubmitBtn = true;
          self.handleFirstAnswersConditions();
        };

        self.next2 = function (e) {
          if (self.firstAnswers.length === 0) {
            self.formError = true;
            return true;
          }
          self.formError = self.firstAnswers.length === 0;
          self.secondQPage = true;
          self.hideSubmitBtn = self.firstQPage = self.secondAnsweredYes = self.secondAnsweredNo = false;
        };

        self.handleFirstAnswersConditions = function () {
          self.formError = self.firstAnswers.length === 0;
          if (self.hideSubmitBtn) {
            self.showAnsweredCorrectly = self.firstAnswers.length === 3;
            self.showAnsweredInCorrectly = self.firstAnswers.length !== 3;
          }
        };


        /*
        * 2nd Question
        */
        self.secondAnsweredYes = false;
        self.secondAnsweredNo = false;
        self.secondAnswer = '';
        self.selectSecondAnswer = function(e) {
          self.secondAnswer = e.target.value;
          self.handleSecondAnswersConditions();
        };

        self.submitSecondAnswer = function(e) {
          e.preventDefault();
          if (self.secondAnswer === "") {
            self.formError = true;
            return true;
          }

          self.hideSubmitBtn = true;
          self.handleSecondAnswersConditions();
        };

        self.previous1 = function (e) {
          self.firstQPage = true;
          self.hideSubmitBtn = self.secondQPage = self.showAnsweredCorrectly = self.showAnsweredInCorrectly = false;
        };

        self.next3 = function (e) {
          if (self.secondAnswer === "") {
            self.formError = true;
            return true;
          }

          self.thirdQPage = true;
          self.hideSubmitBtn = self.secondQPage = self.showThirdAnsweredCorrectly = self.showThirdAnsweredInCorrectly = false;
        };

        self.handleSecondAnswersConditions = function () {
          self.formError = self.secondAnswer === "";
          if (self.hideSubmitBtn) {
            self.secondAnsweredYes = self.secondAnswer === "YES";
            self.secondAnsweredNo = self.secondAnswer === "NO";
          }
        };


        /*
        * 3rd Question
        */
        self.showThirdAnsweredCorrectly = false;
        self.showThirdAnsweredInCorrectly = false;
        self.thirdAnswers = [];
        self.selectThirdAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.thirdAnswers.push(val);
          } else {
            self.thirdAnswers.pop();
          }

          self.handleThirdAnswersConditions();
        };

        self.submitThirdAnswer = function(e) {
          e.preventDefault();
          if (self.thirdAnswers.length === 0) {
            self.formError = true;
            return true;
          }

          self.hideSubmitBtn = true;
          self.handleThirdAnswersConditions();
        };

        self.previous2 = function (e) {
          self.secondQPage = true;
          self.hideSubmitBtn = self.thirdQPage = self.secondAnsweredYes = self.secondAnsweredNo = false;
        };

        self.next4 = function (e) {
          if (self.thirdAnswers.length === 0) {
            self.formError = true;
            return true;
          }
          self.fourthQPage = true;
          self.hideSubmitBtn = self.thirdQPage = self.fourthAnsweredYes = self.fourthAnsweredNo = false;
        };

        self.handleThirdAnswersConditions = function () {
          self.formError = self.thirdAnswers.length === 0;
          if (self.hideSubmitBtn) {
            self.showThirdAnsweredCorrectly = self.thirdAnswers.length === 4;
            self.showThirdAnsweredInCorrectly = self.thirdAnswers.length !== 4;
          }
        };

        
        /*
        * 4th Question
        */
        self.fourthAnsweredYes = false;
        self.fourthAnsweredNo = false;
        self.fourthAnswer = '';
        self.selectFourthAnswer = function(e) {
          self.fourthAnswer = e.target.value;
          self.handleFourthAnswersConditions();
        };

        self.submitFourthAnswer = function(e) {
          e.preventDefault();
          if (self.fourthAnswer === "") {
            self.formError = true;
            return true;
          }

          self.hideSubmitBtn = true;
          self.handleFourthAnswersConditions();
        };

        self.previous3 = function (e) {
          self.thirdQPage = true;
          self.hideSubmitBtn = self.fourthQPage = self.showThirdAnsweredCorrectly = self.showThirdAnsweredInCorrectly = false;
        };

        self.next5 = function (e) {
          self.hideSubmitBtn = self.fourthQPage = false;
          if (self.isMemberHasTeleHealth) {
            self.showTeleHealthAnsweredCorrectly = self.showTeleHealthAnsweredInCorrectly = false;
            self.teleHealthPage = true;
            return true;
          }
          if (self.isMemberHasHealthLineBlue) {
            self.showHealthLineBlueAnsweredCorrectly = self.showHealthLineBlueAnsweredInCorrectly = false;
            self.healthLineBluePage = true;
            return true;
          }
          self.rewardPage = true;
        };

        self.handleFourthAnswersConditions = function () {
          self.formError = self.secondAnswer === "";
          if (self.hideSubmitBtn) {
            self.fourthAnsweredYes = self.fourthAnswer === 'YES';
            self.fourthAnsweredNo = self.fourthAnswer === 'NO';
          }
        };

        
        /*
        * Tele Health
        */
        self.showTeleHealthAnsweredCorrectly = false;
        self.showTeleHealthAnsweredInCorrectly = false;
        self.teleHealthAnswers = [];
        self.selectTeleHealthAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.teleHealthAnswers.push(val);
          } else {
            self.teleHealthAnswers = self.teleHealthAnswers.filter(function(answer){
              return answer !== val;
            });
          }

          self.handleTeleHealthAnswersConditions();
        };

        self.submitTeleHealthAnswers = function(e) {
          e.preventDefault();
          if (self.teleHealthAnswers.length === 0) {
            self.formError = true;
            return true;
          }
          
          self.hideSubmitBtn = true;
          self.handleTeleHealthAnswersConditions();
        };

        self.previous4 = function (e) {
          self.fourthQPage = true;
          self.hideSubmitBtn = self.teleHealthPage = self.fourthAnsweredYes = self.fourthAnsweredNo = false;
        };

        self.next6 = function (e) {
          if (self.teleHealthAnswers.length === 0) {
            self.formError = true;
            return true;
          }
          self.hideSubmitBtn = false;
          self.teleHealthPage = false;
          if (self.isMemberHasHealthLineBlue) {
            self.showHealthLineBlueAnsweredCorrectly = self.showHealthLineBlueAnsweredInCorrectly = false;
            self.healthLineBluePage = true;
            return true;
          }
          self.rewardPage = true;
        };

        self.handleTeleHealthAnswersConditions = function() {
          self.formError = self.teleHealthAnswers.length === 0;
          if (self.hideSubmitBtn) {
            var isAnswerCorrect = self.teleHealthAnswers.length === 4 && self.teleHealthAnswers.indexOf("'Chest Pain'") === -1;
            self.showTeleHealthAnsweredCorrectly = isAnswerCorrect;
            self.showTeleHealthAnsweredInCorrectly = !isAnswerCorrect;
          }
        };

        
        /*
        * Health Line Blue
        */
        self.showHealthLineBlueAnsweredCorrectly = false;
        self.showHealthLineBlueAnsweredInCorrectly = false;
        self.healthLineBlueAnswers = [];
        self.selectHealthLineBlueAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.healthLineBlueAnswers.push(val);
          } else {
            self.healthLineBlueAnswers.pop();
          }

          self.handleHealthLineBlueAnswersConditions();
        };

        self.submitHealthLineBlueAnswers = function(e) {
          e.preventDefault();
          if (self.healthLineBlueAnswers.length === 0) {
            self.formError = true;
            return true;
          }

          self.hideSubmitBtn = true;
          self.handleHealthLineBlueAnswersConditions();
        };

        self.previous5 = function (e) {
          self.teleHealthPage = self.isMemberHasTeleHealth;
          self.fourthQPage = !self.isMemberHasTeleHealth;
          self.hideSubmitBtn = self.healthLineBluePage = self.showTeleHealthAnsweredCorrectly = self.showTeleHealthAnsweredInCorrectly = self.fourthAnsweredYes = self.fourthAnsweredNo = false;
        };

        self.next7 = function (e) {
          if (self.healthLineBlueAnswers.length === 0) {
            self.formError = true;
            return true;
          }
          self.hideSubmitBtn = self.healthLineBluePage = false;
          self.rewardPage = true;
        };

        self.handleHealthLineBlueAnswersConditions = function () {
          self.formError = self.healthLineBlueAnswers.length === 0;
          if (self.hideSubmitBtn) {
            self.showHealthLineBlueAnsweredCorrectly = self.healthLineBlueAnswers.length === 4;
            self.showHealthLineBlueAnsweredInCorrectly = self.healthLineBlueAnswers.length !== 4;
          }
        };

        
        /*
        * Rewards
        */

        self.previous6 = function (e) {
          self.rewardPage = false;
          if (self.isMemberHasHealthLineBlue) {
            self.healthLineBluePage = true;
            self.hideSubmitBtn = self.showHealthLineBlueAnsweredCorrectly = self.showHealthLineBlueAnsweredInCorrectly = false;
            return true;
          }
          if (self.isMemberHasTeleHealth) {
            self.teleHealthPage = true;
            self.hideSubmitBtn = self.showTeleHealthAnsweredCorrectly = self.showTeleHealthAnsweredInCorrectly = false;
            return true;
          }
        };

        self.printCustomizedGuide = function() {

          self.surveyConfirmation = true;

          var currDate = moment().toISOString();
          // TouchPoint Service POST Data
          var surveyData = {
            success: "Y",
            "eventEndTimestamp":currDate,
            "eventStartTimestamp":currDate,
            "extensionDataElement":[
              {
                "name":"ImportanceofRegularDoctor",
                "value":self.firstAnswers.length > 0 ? self.firstAnswers.join(',') : ''
              },
              {
                "name":"haveRegulardoctorForRoutineCheckups",
                "value":self.secondAnswer === 'YES' ? "YES,'DoctorName':"+"'"+self.doctorName+"',"+"'PhoneNumber':"+"'"+self.doctorPhoneNumber+"',"+"'OfficeHours':"+"'"+self.officeHours+"',"+"'AfterOurHours':"+"'"+self.afterHoursNumber+"'" : 'NO'
              },
              {
                "name":"whyGoToConvenienceCareOrUrgentCareCenter",
                "value":self.thirdAnswers.length > 0 ? self.thirdAnswers.join(',') : ''
              },
              {
                "name":"whichUrgentcareCenterClosestToYourHome",
                "value": self.fourthAnswer === 'YES' ? "YES,'NameLocation':"+"'"+self.careCenterNameAndLocation+"',"+"'PhoneNumber':"+"'"+self.careCenterPhoneNumber+"',"+"'Hours':"+"'"+self.careCenterOpeningHours+"'" : 'NO'
              },
              {
                "name":"healthIssuesHandledByTelehealthConsultant",
                "value":self.teleHealthAnswers.length > 0 ? self.teleHealthAnswers.join(',') : ''
              },
              {
                "name":"phoneNumberForOurNurseSupportLine",
                "value":self.healthLineBlueAnswers.length > 0 ? self.healthLineBlueAnswers.join(',') : ''
              }
            ]
          };

          // Calling Touch Point Service
          trackFactory.set('SURVEY_ACTIVITY_CENTER', surveyData, false, true);

          // Print Quick Reference Guide PDF
          var documentId = 'pdfDocument';
          var printedContentId = 'printedCustimizedGuide0';
          var doc = document.getElementById(documentId);
          var printedContent = document.getElementById(printedContentId).innerHTML;

          doc.contentWindow.document.body.innerHTML = printedContent;

          doc.contentWindow.focus();
          doc.contentWindow.print();
        };


        /*
        * Common
        */
        self.onInputChange = function(e) {
          self[e.target.name] = e.target.value;
        };
      }
    ]);
})(this, window.angular);
