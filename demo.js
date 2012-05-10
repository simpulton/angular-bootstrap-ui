
function ModalCtrl($scope, bootstrapModal) {
	$scope.opts = "both"
	$scope.effect = '';
	$scope.effectTime = "250";

	$scope.openModal = function() {
		bootstrapModal.show(
			'aboutModal', 
			$scope.opts == "both" || $scope.opts == "backdrop",
			$scope.opts == "both" || $scope.opts == "escape",
			$scope.effect, 
			parseInt( $scope.effectTime )
		);
	};
};


function TabsCtrl($scope) {
	$scope.things = [];
	$scope.add = function() {
		$scope.things.push({
			thingTitle: "thing "+$scope.things.length,
			date: new Date()
		});
	};
	$scope.remove = function(item) {
		$scope.things.splice( $scope.things.indexOf(item), 1 );
	};
	$scope.update = function(item) {
		item.date = new Date();
	};
	$scope.onItemSel = function(item) {
		$scope.lastSelectedItem = $scope.things.indexOf(item);
	}
};