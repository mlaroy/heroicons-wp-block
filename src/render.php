

<?php
/**
 * Block markup
 *
 * @var array    $attributes         Block attributes.
 * @var WP_Block $block              Block instance.
 */
$radius = ( isset( $attributes['borderRadius'] ) ) ? 'border-radius: '. $attributes['borderRadius'] . '%;' : '';

$svg_allowed = array(
	'svg' => array(
		'xmlns' => true,
		'viewbox' => true,
		'id' => true,
		'fill' => true,
		'width' => true,
		'height' => true,
		'aria-hidden' => true,
		'role' => true,
		'focusable' => true,
		'class' => true,
		'role' => true
	),
	'path' => array(
		'd' => true,
		'fill' => true,
		'class' => true,
		'fill-rule' => true,
		'clip-rule' => true,
		'stroke' => true,
		'stroke-linecap' => true,
		'stroke-width' => true,
		'stroke-linejoin' => true,
	),
);
?>

<div class="heroicon-template-container">
	<span <?php echo get_block_wrapper_attributes([
		'style' => '--heroicon-size: ' . esc_attr($attributes['iconSize']) . 'px;'.esc_attr( $radius )
	]); ?>>
		<?php echo wp_kses( $attributes['selectedIcon']['svg'], $svg_allowed ); ?>
	</span>
</div>
