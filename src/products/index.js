import PropTypes from 'prop-types';
import products from './products.json'
import {Col, Container, InputGroup, Row, Dropdown, DropdownButton, FormControl, Button} from "react-bootstrap";
import {useEffect, useState} from "react";

import "./style.css"

import config from '../config/config.json'
import {getItemsByCurrency} from "./exchange";

export const CurrencySwitch = ({defaultCurrency, currencies, callback}) => {
  // noinspection JSUnresolvedVariable
  return (
    <InputGroup className="mb-3">
      <DropdownButton
        variant="outline-secondary"
        title={`Currency: ${defaultCurrency}`}
        id="input-group-dropdown-1"
      >
        {
          currencies.map(
            currency => (
              <Dropdown.Item key={currency} href="#" onClick={() => callback(currency)}>
                {currency}
              </Dropdown.Item>
            ))
        }
      </DropdownButton>
    </InputGroup>
  )
}

export const SearchBar = ({onSearch, onReset}) => {
  const [searchKey, setSearch] = useState("")

  const search = () => {
    const key = searchKey.trim()
    if (key.length > 0) {
      onSearch(key)
    }
  }

  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Search Product"
        aria-label="Search Product"
        aria-describedby="basic-addon2"
        onChange={(e) => setSearch(e.target.value)}
        value={searchKey}
      />
      <Button variant="outline-secondary" id="button-addon2" onClick={search}>
        Search
      </Button>
      <Button variant="outline-secondary" id="button-addon2" className="reset"
              style={{marginLeft: "8px"}} onClick={onReset}>
        Reset
      </Button>
    </InputGroup>
  )
}

export const Products = (props) => {
  // noinspection JSUnresolvedVariable
  return (
    <Container>
      <Row>
        {
          props.items.map(item => (
            <Col key={item.id} xs={6} md={3} sm={2} className="item-col">
              <div className="item">
                <img src={item.image} alt="item" className="item-image"/>
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">{item.displayPrice} {item.displayCurrency}</p>
                </div>
              </div>
            </Col>
          ))
        }
      </Row>
    </Container>
  )
}

Products.propTypes = {
  items: PropTypes.array.isRequired
}

const Listing = () => {
  const currencies = config.currency.supported
  const [currency, setCurrency] = useState(config.currency.default)
  const [items, setItems] = useState([])

  const onCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency)
    refreshItemCurrency(items, newCurrency)
  }

  const onSearch = (searchKey) => {
    const searchSet = searchKey.split(' ').map(key => key.toLowerCase().trim())
    const filteredItems = products.filter(item => searchSet.some(key => item.name.toLowerCase().includes(key)))
    refreshItemCurrency(filteredItems, currency)
  }

  const onReset = () => {
    refreshItemCurrency(products, currency)
  }

  const refreshItemCurrency = (items, currency) => {
    getItemsByCurrency(items, currency)
      .then(updatedItems => setItems(updatedItems))
  }

  useEffect(() => {
    refreshItemCurrency(products, currency)
  }, [])

  return (
    <div className="listing">
      <Container>
        <Row className="justify-content-between">
          <Col md={3} sm={3} xs={3} className="search-bar">
            <CurrencySwitch defaultCurrency={currency} currencies={currencies} callback={onCurrencyChange}/>
          </Col>
          <Col md={6} sm={7} xs={7} className="search-bar">
            <SearchBar onSearch={onSearch} onReset={onReset}/>
          </Col>
        </Row>
      </Container>
      <div>
        <Products items={items}/>
      </div>
    </div>
  )
}

export default Listing