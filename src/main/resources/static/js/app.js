var app = angular.module('locomotive', [
    'ui.bootstrap',
    'ui.router',
    'ngLodash'
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

app.factory('ApiService', function ($q, $http, MessagesService) {
    var errorHandler = function (err, msg) {
        console.error(err);
        MessagesService.setError(msg);
    };

    var baseApiGet = function (uri) {
        return $q(function (resolve, reject) {
            $http.get(uri).then(function (data) {
                if (data.data._embedded === undefined) {
                    resolve(data.data);
                } else {
                    resolve(data.data._embedded);
                }
            }).catch(function (err) {
                errorHandler(err, 'An unknown error occurred while processing your request!');
                reject(err);
            });
        });
    };

    var getObjName = function (obj) {
        return obj.name === undefined ? 'object' : obj.name;
    };

    return {
        baseUris: {
            project: '/api/projects',
            release: '/api/releases'
        },

        getProject: function (id) {
            return baseApiGet(this.baseUris.project + '/' + id);
        },

        getProjects: function () {
            return baseApiGet(this.baseUris.project);
        },

        getReleasesForProject: function (projectId) {
            return baseApiGet(this.baseUris.release + '/search/findByProjectId?projectId=' + projectId)
        },

        removeObject: function (obj) {
            return $q(function (resolve, reject) {
                $http.delete(obj._links.self.href).then(function () {
                    MessagesService.setSuccess('Successfully deleted ' + getObjName(obj));
                    resolve();
                }).catch(function (err) {
                    errorHandler(err, 'An error occurred while processing your delete request!');
                    reject(err);
                });
            });
        },

        createObject: function (endpoint, obj) {
            return $q(function (resolve, reject) {
                $http.post(endpoint, obj).then(function (data) {
                    MessagesService.setSuccess('Successfully created ' + getObjName(obj));
                    resolve(data.data);
                }).catch(function (err) {
                    errorHandler(err, 'An error occurred while processing your creation request!');
                    reject(err);
                });
            });
        },

        saveObject: function (obj) {
            return $q(function (resolve, reject) {
                $http.put(obj._links.self.href, obj).then(function (data) {
                    MessagesService.setSuccess('Successfully saved ' + getObjName(obj));
                    resolve(data.data);
                }).catch(function (err) {
                    errorHandler(err, 'An error occurred while processing your creation request!');
                    reject(err);
                });
            });
        }
    }
});

app.controller('IndexController', function ($scope, MessagesService) {
    $scope.messages = MessagesService;
});

app.controller('ProjectHomeController', function($scope, lodash, ApiService, MessagesService) {
    $scope.projects = [];
    $scope.projectToAdd = {};

    ApiService.getProjects().then(function (data) {
        $scope.projects = data.projects;
    });
    
    $scope.addProject = function() {
        $scope.projectToAdd.name = '';
    };

    $scope.saveProject = function () {
        if ($scope.projectToAdd.name.length === 0) {
            MessagesService.setError('Project must have a name!')
            return;
        }

        ApiService.createObject(ApiService.baseUris.project, $scope.projectToAdd).then(function (data) {
            $scope.projects.push(data);
            $scope.projectToAdd = {};
        });
    };
});

app.controller('SelectedProjectController', function ($scope, $stateParams, $state, ApiService) {
    $scope.releases = [];
    $scope.project = null;
    $scope.editingName = false;

    ApiService.getProject($stateParams.projectId).then(function (data) {
        $scope.project = data;

        ApiService.getReleasesForProject($stateParams.projectId).then(function (data) {
            $scope.releases = data.releases;
        });
    });

    $scope.removeProject = function() {
        ApiService.removeObject($scope.project).then(function () {
            $state.go('index');
        });
    };

    $scope.saveProject = function () {
        ApiService.saveObject($scope.project).then(function () {
            $scope.editingName = false;
        });
    };
});

app.controller('SelectedReleaseController', function ($stateParams, ApiService) {
    
});