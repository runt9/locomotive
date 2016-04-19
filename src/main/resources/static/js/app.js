var app = angular.module('locomotive', [
    'ui.bootstrap',
    'ui.router',
    'ngLodash'
]);

app.config(function ($stateProvider) {
    $stateProvider
        .state('index', {
            url: '',
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

        getObject: function (endpoint, id) {
            return baseApiGet(endpoint + '/' + id);
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
    
    $scope.saveProject = function () {
        if ($scope.projectToAdd.name.length === 0) {
            MessagesService.setError('Project must have a name!');
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
    $scope.releaseToAdd = {};

    ApiService.getObject(ApiService.baseUris.project, $stateParams.projectId).then(function (data) {
        $scope.project = data;
        $scope.updateReleases();
    });

    $scope.updateReleases = function() {
        ApiService.getReleasesForProject($stateParams.projectId).then(function (data) {
            $scope.releases = data.releases;
        });
    };

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

    $scope.saveRelease = function () {
        if ($scope.releaseToAdd.name.length === 0) {
            MessagesService.setError('Release must have a name!');
            return;
        }

        $scope.releaseToAdd.projectId = $scope.project.id;
        ApiService.createObject(ApiService.baseUris.release, $scope.releaseToAdd).then(function (data) {
            $scope.releases.push(data);
            $scope.releaseToAdd = {};
        });
    };
});

app.controller('SelectedReleaseController', function ($scope, $stateParams, $state, lodash, ApiService) {
    $scope.release = null;
    $scope.editingName = false;
    $scope.preEditStory = null;
    $scope.preEditTest = null;
    
    ApiService.getObject(ApiService.baseUris.release, $stateParams.releaseId).then(function (data) {
        $scope.release = data;
    });

    $scope.saveRelease = function () {
        lodash.each($scope.release.stories, function(s) {
            lodash.each(s.tests, function (t) {
                delete t.editing;
                delete t.isNew;
            });

            delete s.editing;
            delete s.isNew;
        });

        ApiService.saveObject($scope.release).then(function () {
            $scope.editingName = false;
            $scope.$parent.updateReleases();
            $scope.preEditStory = null;
            $scope.preEditTest = null;
        });
    };

    $scope.removeRelease = function () {
        ApiService.removeObject($scope.release).then(function () {
            $scope.$parent.updateReleases();
            $state.go('project');
        });
    };

    $scope.getTestStatus = function(story) {
        var completed = 0,
            total = 0;

        lodash.each(story.tests, function(t) {
            total++;

            if (lodash.find(t.environments, {completed: false, inUse: true}) === undefined) {
                completed++;
            }
        });

        return completed + ' complete / ' + total + ' total';
    };
    
    $scope.toggleStoryDetails = function (story) {
        var show = !story.showDetails;
        
        lodash.each($scope.release.stories, function (s) {
            s.showDetails = false;
            $scope.cancelEditingStory(s);
        });
        
        if (show) {
            story.showDetails = true;
        }
    };

    $scope.getUniqueEnvironments = function() {
        var environments = [];

        lodash.each($scope.$parent.releases, function (r) {
            lodash.each(r.stories, function (s) {
                lodash.each(s.tests, function (t) {
                    lodash.each(t.environments, function (e) {
                        if (lodash.indexOf(environments, e.name) === -1) {
                            environments.push(e.name);
                        }
                    });
                });
            });
        });

        return environments;
    };
    
    $scope.addStory = function() {
        if ($scope.release.stories === null) {
            $scope.release.stories = []
        }

        $scope.release.stories.unshift({editing: true, isNew: true, showDetails: true});
    };

    $scope.editStory = function(story) {
        $scope.preEditStory = story;
        story.editing = true;
    };
    
    $scope.cancelEditingStory = function(story) {
        lodash.remove($scope.release.stories, function (s) {
            return s.editing;
        });

        if (!story.isNew && $scope.preEditStory !== null) {
            $scope.preEditStory.editing = false;
            $scope.release.stories.push($scope.preEditStory);
            $scope.preEditStory = null;
        }
    };

    $scope.removeStory = function(story) {
        lodash.remove($scope.release.stories, story);
        $scope.saveRelease();
    };

    $scope.removeTag = function(story, tag) {
        lodash.remove(story.tags, function (t) { return t === tag; });
        $scope.saveRelease();
    };

    $scope.addTest = function(story) {
        if (story.tests === null) {
            story.tests = []
        }

        var test = {
            editing: true,
            isNew: true,
            environments: []
        };

        lodash.each($scope.getUniqueEnvironments(), function (e) {
            test.environments.push({
                name: e,
                inUse: false,
                completed: false
            });
        });

        story.tests.unshift(test);
    };

    $scope.editTest = function(test) {
        $scope.preEditTest = lodash.cloneDeep(test);
        test.editing = true;
    };

    $scope.cancelEditingTest = function(story, test) {
        lodash.remove(story.tests, function (t) {
            return t.editing;
        });

        if (!test.isNew && $scope.preEditTest !== null) {
            $scope.preEditTest.editing = false;
            story.tests.push($scope.preEditTest);
            $scope.preEditTest = null;
        }
    };

    $scope.removeTest = function(story, test) {
        lodash.remove(story.tests, test);
        $scope.saveRelease();
    };
});