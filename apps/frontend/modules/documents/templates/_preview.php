<?php use_helper('JavascriptQueue') ?>

<div id="preview" style="display:none;">
</div>

<?php if ($concurrent_edition) {
echo javascript_queue("$.post('" . url_for($sf_context->getModuleName() . "/ViewCurrent?id=$id&lang=$lang") ."')
.done(function(data) {
  var preview = $('#preview');
  preview.html(data).show();
  $('html, body').animate({scrollTop: preview.offset().top - 35}, 2000);
});");

}
