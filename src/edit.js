/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { Button, Modal, Flex, FlexItem, RadioControl, SearchControl } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import { matchSorter } from 'match-sorter'

import { tags } from './tags.js'
import { icons } from './icons.js'


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

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
export default function Edit({ attributes: { svg, style }, setAttributes }) {
	const [ isOpen, setOpen ] = useState( false );
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ selectedIcon, setSelectedIcon ] = useState(null);
	const searchEl = useRef(null);

	const openModal = () => {
		setOpen(true);
		setTimeout(() => {
			searchEl.current.focus()
		}, 500);
	}

	useEffect(() => {
		setAttributes( { style: style ? style : 'solid' } );
	}, []);

	const onChangeSelectedIcon = icon => {
		setSelectedIcon(icon);
		setAttributes( { svg: icon.svg } );
	};

	const onChangeStyle = name => {
		setAttributes( { style: name } );
	};

	const getallIcons = () => {
		return Array.from(icons[style]).map(icon => {
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

	return (
		<div { ...useBlockProps() }>
			{svg && (
				<Button
					label="Change icon"
					variant="secondary"
					onClick={openModal}
					showTooltip={true}
					>
					<span id="selected-icon" dangerouslySetInnerHTML={{ __html: svg }}></span>
				</Button>
			)}

			{!svg && <Button variant="primary" onClick={openModal}>
				{ __( 'Choose Icon', 'heroicons' ) }
            </Button>}
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
								selected={ style }
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
													<span dangerouslySetInnerHTML={{__html: icon.svg}}></span>
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
		</div>
	);
}
