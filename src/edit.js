/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	Modal,
	Flex,
	FlexItem,
	RadioControl,
	SearchControl,
	RangeControl,
	PanelBody,
	Toolbar,
	ToolbarButton,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import {
    more,
    starEmpty,
	starFilled,
	pencil,

} from '@wordpress/icons';

import { matchSorter } from 'match-sorter'

import { tags } from './tags.js'
import { icons } from './icons.js'


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({
		attributes: { selectedIcon, svg, iconStyle, borderRadius, iconSize, style },
		setAttributes
}) {
	const [ isOpen, setOpen ] = useState( false );
	const [ searchTerm, setSearchTerm ] = useState('');
	const searchEl = useRef(null);

	const openModal = () => {
		setOpen(true);
		setTimeout(() => {
			searchEl.current.focus()
		}, 0);
	}

	useEffect(() => {
		setAttributes( { iconStyle: iconStyle ? iconStyle : 'solid' } );
		setAttributes( { iconSize: iconSize ? iconSize : 48 } );
	}, []);


	/**
	 * We keep track of the object (selectedIcon) and the string (svg) separately
	 * so that we can pass the string into the render template, and mange the object
	 * here in the edit file, and change out the svg string when the iconStyle changes.
	 */
	const onChangeSelectedIcon = icon => {
		setAttributes( { selectedIcon: icon } )
		setAttributes( { svg: icon.svg } );
	};

	const onChangeStyle = iconStyle => {
		setAttributes( { iconStyle } );

		/**
		 * applies only after the first time an icon is selected.
		 * It is possible to change the style while the modal is
		 * open, in which case the selected icon is still null.
		 */
		if( selectedIcon ) {
			onChangeSelectedIcon(icons[iconStyle].find(icon => icon.name === selectedIcon.name));
		}
	};

	const setIconSize = iconSize => {
		setAttributes( { iconSize } );
	};

	const setRadius = borderRadius => {
		setAttributes( { borderRadius } );
	};

	const getallIcons = () => {
		return Array.from(icons[iconStyle]).map(icon => {
			return {
				name: icon.name,
				svg: icon.svg,
				tags: tags[icon.name],
			}
		});
	}

	const filteredIcons = () => {
        const icons = getallIcons();
        return searchTerm !== '' ? matchSorter(icons, searchTerm.replace(/\s+/, '-'), { keys: ['name', 'tags'] })
        : icons;

    }

	const blockProps = useBlockProps( {
		style: {
			borderRadius: borderRadius ? borderRadius + '%' : '0px',
		}
	});

	return (
		<div>
			<div className="heroicons-edit-container">
				{!selectedIcon && <Button variant="link" onClick={openModal}>
					{ __( 'Choose Icon', 'heroicons' ) }
				</Button>}
				{/* <div   { ...blockProps }> */}
					{selectedIcon && <span
					{ ...blockProps }
						style={{
							width: iconSize + 'px',
							height: iconSize + 'px',
						}}
						id="selected-icon"
						dangerouslySetInnerHTML={{ __html: selectedIcon.svg }}>
					</span>}
				{/* </div> */}
			</div>
			{ isOpen && (
				<Modal className="heroicons-modal" isFullScreen="true" title="Select your icons" onRequestClose={ () => setOpen( false ) }>
					<Flex align="center" justify="flex-start" gap="2rem">
						<FlexItem>
							<SearchControl
								ref={searchEl}
								value={ searchTerm }
								onChange={ setSearchTerm }
							/>
						</FlexItem>
						<FlexItem>
							<RadioControl
								hideLabelFromVision={true}
								label="Select style"
								selected={ iconStyle }
								flexDirection="row"
								options={ [
									{ label: 'Solid', value: 'solid' },
									{ label: 'Outline', value: 'outline' },
								] }
								onChange={ ( value ) => onChangeStyle( value ) }
							/>
						</FlexItem>
					</Flex>
					<div className="icons-grid">
						{filteredIcons().map(icon => {
							return (
								<div className="heroicon-container">
									<div className="heroicon-button-container">
										<Button
											variant="tertiary"
											onClick={() => {
												onChangeSelectedIcon(icon)
												setOpen(false)
											}}
											key={icon.name}
										>
											<Flex align="center" justify="center" direction="column">
												<FlexItem>
													<span  dangerouslySetInnerHTML={{__html: icon.svg}}></span>
												</FlexItem>
											</Flex>
										</Button>
									</div>
									<div>
										<p>{icon.name}</p>
									</div>
								</div>
							);
						})}
					</div>
				</Modal>
			) }
			<InspectorControls>
				<PanelBody title="Heroicon Settings">
					<RangeControl
						label="Border Radius (%)"
						value={ borderRadius }
						onChange={ ( value ) => setRadius( value ) }
						initialPosition={ 0 }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label="Icon size (px)"
						value={ iconSize }
						onChange={ ( value ) => setIconSize( value ) }
						initialPosition={ 24 }
						min={ 8 }
						max={ 96 }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<ToolbarButton label="Bold" text="Change icon" onClick={openModal} />
				{/* <Toolbar label="Style"> */}
					<ToolbarDropdownMenu
						icon={ pencil }
						label="Icon style"
						controls={ [
							{
								title: 'Outline',
								icon: starEmpty,
								isDisabled: iconStyle === 'outline',
								onClick: () =>  onChangeStyle( 'outline'),
							},
							{
								title: 'Solid',
								icon: starFilled,
								isDisabled: iconStyle === 'solid',
								onClick: () => onChangeStyle( 'solid'),
							},
						] }
					/>
				{/* </Toolbar> */}
			</BlockControls>
		</div>
	);
}
