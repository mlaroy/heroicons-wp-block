

<?php
/**
 * Example block markup
 *
 *
 * @var array    $attributes         Block attributes.
 * @var WP_Block $block              Block instance.
 */
$radius = ( isset( $attributes['borderRadius'] ) ) ? 'border-radius: '. $attributes['borderRadius'] . '%;' : '';
?>
<div>
	<div <?php echo get_block_wrapper_attributes([
		'style' => $radius
	]); ?>>
		<?php echo $attributes['svg']; ?>
	</div>
</div>
