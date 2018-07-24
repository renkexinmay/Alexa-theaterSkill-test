/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');


/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
   var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

    if (accessToken == undefined){
        // The request did not include a token, so tell the user to link
        // accounts and return a LinkAccount card
        var speechText = "You must have a Deepiks account to use this skill. " + 
                    "Please use the Alexa app to link your Amazon account " + 
                    "with your Deepiks Account.";        
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .withLinkAccountCard()
            .getResponse();
    } else {
  	
		const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
		const welcomeMessage = requestAttributes.t('WELCOME_MESSAGE');
		return handlerInput.responseBuilder
		  .speak(welcomeMessage)
		  .reprompt(welcomeMessage)
		  .getResponse();
    },
  },
};
	
var calltime = 0

const generateAnswerIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'generateAnswerIntent';
  },
  handle(handlerInput) {
    var answers = [
	    "The weather is nice today",
	    "How are you",
	    "What a crazy skill!"
    ]
    
    function RandomAns() {
	var randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    }
	  
    function Repeat() {
	    const currentIntent = handlerInput.requestEnvelope.request.intent;
	    var prompt = '';
	    for (const slotName of Object.keys(handlerInput.requestEnvelope.request.intent.slots)) {
		    const currentSlot = currentIntent.slots[slotName]; 
		    console.log(currentSlot.value);
		    prompt = currentSlot.value + prompt
	    }
	    prompt = 'You said '+ prompt;
	    calltime ++;
	    if(calltime > 1) { 
		    var repeatAnswer = "";
	    } else {
		    var repeatAnswer = prompt;
	    }
    }
	  
    return handlerInput.responseBuilder
      .speak(repeatAnswer + randomAnswer)
      .reprompt(repeatAnswer + randomAnswer)
      .withSimpleCard('theater play learning', randomAnswer)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('theater play learning', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('theater play learning', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();


const languageStrings = {
  en: {
    translation: {
      SKILL_NAME: 'Minecraft Helper',
      WELCOME_MESSAGE: 'Do you want to start a specific scene or restart where we left last time',
      WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
      DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
      HELP_MESSAGE: 'You can ask questions such as, what\'s the recipe for a %s, or, you can say exit...Now, what can I help you with?',
      HELP_REPROMPT: 'You can say things like, what\'s the recipe for a %s, or you can say exit...Now, what can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
      RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
      RECIPE_NOT_FOUND_MESSAGE: 'I\'m sorry, I currently do not know ',
      RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
      RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
      RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?'
    },
  },
  fr: {
    translation: {
      SKILL_NAME: 'Assistent für Minecraft in Deutsch',
      WELCOME_MESSAGE: 'Do you want to start a specific scene or restart where we left last time',
      WELCOME_REPROMPT: 'Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.',
      DISPLAY_CARD_TITLE: '%s - Rezept für %s.',
      HELP_MESSAGE: 'Du kannst beispielsweise Fragen stellen wie „Wie geht das Rezept für eine %s“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
      HELP_REPROMPT: 'Du kannst beispielsweise Sachen sagen wie „Wie geht das Rezept für eine %s“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
      STOP_MESSAGE: 'Auf Wiedersehen!',
      RECIPE_REPEAT_MESSAGE: 'Sage einfach „Wiederholen“.',
      RECIPE_NOT_FOUND_MESSAGE: 'Tut mir leid, ich kenne derzeit ',
      RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'das Rezept für %s nicht. ',
      RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'dieses Rezept nicht. ',
      RECIPE_NOT_FOUND_REPROMPT: 'Womit kann ich dir sonst helfen?'
    },
  },
};



// Finding the locale of the user
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    };
  },
};


exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    generateAnswerIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
