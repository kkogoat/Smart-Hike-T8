import { useEffect, useState } from 'react'
import { useSearchBox } from 'react-instantsearch-hooks-web'
import useDebounce from './useDebounce'

/**
 * https://www.algolia.com/doc/api-reference/widgets/search-box/react/
 * https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
 */

const SearchBoxBasic = (props) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [text, updateText] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 1000)
    const { query, refine, isSearchStalled } = useSearchBox(props)

    useEffect(() => {
        if (debouncedSearchTerm) {
            if (searchTerm.length !== 0) {
                // execute search if user stopped typing and the string is not empty
                refine(searchTerm)
            }
        } else {
            refine('')
        }
    }, [debouncedSearchTerm])
    useEffect(() => {
        // set initial search term if provided
        if (props.initText !== "") {
            updateText(props.initText)
            setSearchTerm(props.initText)
        }
    }, [props])

    const handleChange = (e) => {
        // linking input text with search function
        updateText(e.target.value)
        setSearchTerm(e.target.value)
    }

    return (
        <form noValidate action="" role="search">
            <input
                type="search"
                value={text}
                onChange={handleChange}
            />
        </form>
    )
}

export default SearchBoxBasic;