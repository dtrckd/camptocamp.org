<?php
use_helper('MyForm', 'Javascript');
echo link_to_function(picto_tag('action_cancel', __('close')),
                      'new Effect.BlindUp($(this).up());',
                      array('style' => 'float:right;'));
echo $image_name;
echo global_form_errors_tag();