import React from 'react';
import { Link } from 'react-router-dom';

import graphQLFetch from './graphQLFetch.js';

export default class ProductEdit extends React.Component {
// to store the current value of each input
  constructor() {
    super();
    this.state = {
      product: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  handleSubmit(e) {
    e.preventDefault();
    const { product } = this.product;
    console.log(product); // eslint-disable-line no-console
  }
//replacing the empty product with product fetched from the server.
  async loadData() {
    const query = `query getproduct($id: Int!) {
      getproduct(id: $id) {
        id category productname price image
      }
    }`;
//to fetch the data from the productlist when edit button is clicked
    const { match: { params: { id } } } = this.props;
	idx = parseInt(id);
    const data = await graphQLFetch(query, { idx });
    if (data) {
      const { product } = data;
      product.price = product.price ? product.price.toString() : '';
      product.image = product.image != null ? product.image.toString() : '';
      this.setState({ product });
    } else {
      this.setState({ product: {} });
    }
  }

  render() {
    const { product: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id === null) {
   
	//if the id field is not valid 
      if (propsId != null) {
        return <h3>{`Product with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }
 
    const { product: { category } } = this.state;
    const { product: { price } } = this.state;
    const { product: { productname } } = this.state;
    const { product: { image } } = this.state;
	
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>{`Editing product: ${id}`}</h3>
        <table>
          <tbody>
      
            <tr>
              <td>Category:</td>
              <td>
                <select name="category" value={category} onChange={this.onChange}>
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Sweaters">Sweaters</option>
				  <option value="Accessories">Accessories</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>ProductName:</td>
              <td>
                <input
                  name="productname"
                  value={productname}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            <tr>
              <td>Price:</td>
              <td>
                <input
                  name="price"
                  value={price}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            <tr>
              <td>Image:</td>
              <td>
                <input
                  name="image"
                  value={image}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            
            <tr>
              <td />
              <td><button type="submit">Submit</button></td>
            </tr>
          </tbody>
        </table>
        <Link to={`/edit/${id - 1}`}>Prev</Link>
        {' | '}
        <Link to={`/edit/${id + 1}`}>Next</Link>
      </form>
    );
  }
}
