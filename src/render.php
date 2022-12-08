

<?php
/**
 * Block markup
 *
 * @var array    $attributes         Block attributes.
 * @var WP_Block $block              Block instance.
 */
$radius = ( isset( $attributes['borderRadius'] ) ) ? 'border-radius: '. $attributes['borderRadius'] . '%;' : '';
?>

<style>
	:root {
		--heroicon-size: <?php echo $attributes['iconSize']; ?>px;
	}
</style>

<div class="heroicon-template-container">
	<span <?php echo get_block_wrapper_attributes([
		'style' => $radius
	]); ?>>
		<?php echo $attributes['selectedIcon']['svg']; ?>
	</span>
</div>
