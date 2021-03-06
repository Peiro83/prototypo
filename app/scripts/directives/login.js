'use strict';

angular.module('prototypo.loginDirective', [])
	.directive('login', function( hoodie, $location ) {
		return {
			restrict: 'E',
			templateUrl: 'views/login.html',
			replace: true,
			scope: {},
			link: {

				post: function postLink( $scope, $element ) {



					$element.on('pointerdown', '.resetPassword', function() {
						$("#hoodie").toggle();
					});

					$scope.resetPassword = function() {
						if ( $scope.resetpassword.$invalid ) {
							$scope.showErrors = true;
							return;
						}
						hoodie.account.resetPassword($scope.resetEmail)
							.done(function() {
								console.log('success');
								$scope.showSuccess = true;
								$scope.$apply();
							})
							.fail(function() {
								console.log('fail');
							});
					};

					// TOFIX: this watch never fires, find out why!
					$scope.$watch('resetEmail', function() {
						$scope.showErrors = false;
						$scope.resetpassword.$setValidity('pattern', true);
					});

					$scope.signIn = function() {
						if ( $scope.signin.$invalid ) {
							$scope.showErrors = true;
							return;
						}

						hoodie.account.signIn($scope.email, $scope.password)
							.done(function() {
								$location.url($location.search().next || '/');
								$scope.$apply();
							})
							.fail(function() {
								$scope.showErrors = true;
								$scope.signin.$setValidity('dontmatch', false);

								// sometimes the fail callback is called synchronously
								if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
									$scope.$apply();
								}
							});
					};

					$scope.$watch('email + password', function() {
						$scope.signin.$setValidity('dontmatch', true);
						$scope.showErrors = false;
					});

				}
			}
		};
	});