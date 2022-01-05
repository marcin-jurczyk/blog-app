import {useContext, useEffect, useRef, useState} from "react";
import {Tag, Input, Tooltip} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {TagsContext} from "../../../services/tags";
import './layout.css'

export const AddTag = props => {

    const {tags, setTags} = useContext(TagsContext)
    const [inputVisible, setInputVisible] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [editInputIndex, setEditInputIndex] = useState(-1)
    const [editInputValue, setEditInputValue] = useState('')

    const input = useRef()
    const editInput = useRef()

    useEffect(() => {
        if (props.tags)
            setTags(props.tags)
        else
            setTags([])
    }, [])

    const handleClose = removedTag => {
        const newTags = tags.filter(tag => tag !== removedTag);
        console.log(tags);
        setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true)
    };

    const handleInputChange = e => {
        setInputValue(e.target.value)
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue])
            setInputVisible(false)
            setInputValue('')
        }
        console.log(tags);
    };

    const handleEditInputChange = e => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags)
        setEditInputIndex(-1)
        setEditInputValue('')
    };

    return (
        <>
            {tags.map((tag, index) => {
                if (editInputIndex === index) {
                    return (
                        <Input
                            ref={editInput}
                            key={tag}
                            size="small"
                            className="tag-input"
                            value={editInputValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }

                const isLongTag = tag.length > 20;

                const tagElem = (
                    <Tag
                        className="edit-tag"
                        key={tag}
                        closable={true}
                        onClose={() => handleClose(tag)}
                    >
                        <span
                            onDoubleClick={e => {
                                if (index !== 0) {
                                    setEditInputIndex(index)
                                    setEditInputValue(index)
                                    // editInput.current.focus();
                                    e.preventDefault();
                                }
                            }}
                        >
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible && (
                <Input
                    ref={input}
                    type="text"
                    size="small"
                    className="tag-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag className="site-tag-plus" onClick={showInput}>
                    <PlusOutlined/> New Tag
                </Tag>
            )}
        </>
    );
}