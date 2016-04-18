var app = angular.module('locomotive', [
    'ui.bootstrap',
    'spring-data-rest',
    'ui.router'
]);

app.config(function ($stateProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'projectHome.html',
            controller: 'ProjectHomeController'
        })
        .state('project', {
            url: '/project/:projectId',
            templateUrl: 'selectedProject.html',
            controller: 'SelectedProjectController'
        })
        .state('project.release', {
            url: '/release/:releaseId',
            templateUrl: 'selectedRelease.html',
            controller: 'SelectedReleaseController'
        });
});

app.factory('MessagesService', function ($timeout) {
    return {
        error: '',
        success: '',

        setSuccess: function (success) {
            var self = this;
            self.success = success;
            $timeout(function () {
                self.success = '';
            }, 5000);
        },
        
        setError: function (error) {
            var self = this;
            self.error = error;
            $timeout(function () {
                self.error = '';
            }, 5000);
        }
    };
});

app.factory('ApiService', function ($q, $http, SpringDataRestAdapter, MessagesService) {
    var baseApiGet = function (endpoint) {
        return $q(function (resolve, reject) {
            SpringDataRestAdapter.process($http.get(endpoint)).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                console.error(err);
                MessagesService.setError('An unknown error occurred while processing your request!');
                reject(err);
            });
        });
    };

    return {
        getProjects: function () {
            return baseApiGet('/api/projects');
        },
        getReleasesForProject: function (projectId) {
            return baseApiGet('/api/releases/search/findByProjectId?projectId=' + projectId)
        }
    }
});

app.controller('IndexController', function ($scope, MessagesService) {
    $scope.messages = MessagesService;
});

app.controller('ProjectHomeController', function(ApiService) {
    var self = this;
    self.projects = [];

    ApiService.getProjects().then(function (data) {
        self.projects = data._embeddedItems;
    });
});

app.controller('SelectedProjectController', function ($stateParams, ApiService) {
    var self = this;
    self.releases = [];
    
    ApiService.getReleasesForProject($stateParams.projectId).then(function (data) {
        self.releases = data._embeddedItems;
        console.log(self.releases);
    });
});

app.controller('SelectedReleaseController', function ($stateParams, ApiService) {
    
});