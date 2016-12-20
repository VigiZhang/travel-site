var $ = require("jquery");
// import MobileMenu from './modules/MobileMenu';
var MobileMenu = require('./modules/MobileMenu');
// import RevealOnScroll from './modules/RevealOnScroll';
var RevealOnScroll = require('./modules/RevealOnScroll');

var mobileMenu = new MobileMenu();
new RevealOnScroll($(".feature-item"), "85%");
new RevealOnScroll($(".testimonial"), "60%");