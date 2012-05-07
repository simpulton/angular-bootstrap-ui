angular.module('angularBootstrap.modal', []).
directive('bootstrapModal', function($defer) {

	//Default opts
	var defaults = {
		hasBackdrop: true,
		hasEscapeExit: true,
		modalEffect: null,
		effectTime: '250'
	};
	var opts = {};

	var link = function(scope, elm, attrs) {
		opts = angular.extend(defaults, attrs);
		opts.effectTime = parseInt(opts.effectTime);

		var escapeEvent;
		var openModal;
		var closeModal;

		//Escape event has to be declared so that when modal closes,
		//we only unbind modal escape and not everything
		escapeEvent = function(e) {
			if (e.which == 27)
				closeModal();
		};

		openModal = function(event, hasBackdrop, hasEscapeExit) {
			var modal = jQuery('#'+attrs.modalId);

			if (scope.modalOpen !== undefined && scope.modalOpen !== null)
				scope.$apply(function() {
					scope.modalOpen(attrs.modalId);
				});

			//Make click on backdrop close modal
			if (opts.hasBackdrop === true) {
				//If no backdrop el, have to add it
				if (!document.getElementById('modal-backdrop')) {
					jQuery('body').append(
						'<div id="modal-backdrop" class="modal-backdrop"></div>'
					);
				}
				jQuery('#modal-backdrop').
				css({ display: 'block' }).
				bind('click', closeModal);
			}

			//Make escape close modal
			if (opts.hasEscapeExit === true)
				jQuery('body').bind('keyup', escapeEvent);
			
			//Add modal-open class to body
			jQuery('body').addClass('modal-open');

			//Find all the children with class close, 
			//and make them trigger close the modal on click
			jQuery('.modal-close', modal).bind('click', closeModal);

			//modal.css({ display: 'block' });
			if (opts.modalEffect === 'fade') {
				modal.fadeIn(opts.effectTime);
			} else if (attrs.modalEffect === 'slide') {
				modal.slideDown(opts.effectTime);
			} else
			modal.css({ display: 'block' });
		};
		
		closeModal = function(event) {

			if (scope.modalClose !== undefined && scope.modalClose !== null)
				scope.$apply(function() {
					scope.modalClose(attrs.modalId);
				});

			jQuery('#modal-backdrop').
			unbind('click', closeModal).
			css({ display: 'none' });
			jQuery('body').
			unbind('keyup', escapeEvent).
			removeClass('modal-open');
			jQuery('#'+attrs.modalId).css({ display: 'none' });
		};

		//Bind modalOpen and modalClose events, so outsiders can trigger it
		//We have to wait until the template has been fully put in to do this,
		//so we will wait 100ms
		$defer(function() {
			jQuery('#'+attrs.modalId).
			bind('modalOpen', openModal).
			bind('modalClose', closeModal);
		}, 100);
	};

	return {
		link: link,
		restrict: 'E',
		scope: {
			modalId: 'attribute',
			modalOpen: 'evaluate'
		},
		template: '<div id="{{modalId}}" class="modal hide"><div ng-transclude></div></div>',
		transclude: true,
		replace: true
	};
}).
directive('bootstrapModalOpen', function() {
	return function(scope, elm, attrs) {
		var hasBackdrop = attrs.backdrop === undefined ? true : attrs.backdrop;
		var hasEscapeExit = attrs.escapeExit === undefined ? true : attrs.escapeExit;

		//Allow user to specify whether he wants it to open modal on click or what
		//Defaults to click
		var eventType = attrs.modalEvent === undefined ? 'click' : eventType;
		
		jQuery(elm).bind(eventType, function() {
			jQuery('#'+attrs.bootstrapModalOpen).trigger(
				'modalOpen', [hasBackdrop, hasEscapeExit]
			);
		});
	}
});