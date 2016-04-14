var app = angular.module('locomotive', [
    'ngResource',
    'ui.bootstrap',
    'spring-data-rest'
]);

app.config(function (SpringDataRestInterceptorProvider) {
    SpringDataRestInterceptorProvider.apply();
});

app.controller('ProjectController', function ($scope) {

});