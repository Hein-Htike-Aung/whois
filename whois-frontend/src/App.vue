<template>
  <div id="app">
    <h1>Whois Domain Lookup</h1>
    <div class="form-group">
      <input v-model="domainName" placeholder="Enter domain name" />
      <select v-model="type">
        <option value="domain information">Domain Information</option>
        <option value="contact information">Contact Information</option>
      </select>
      <button @click="fetchWhoisData">Lookup</button>
    </div>   
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="domainData">
      <h2>Domain Information</h2>
      <table>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
        <tr v-for="(value, key) in domainData" :key="key">
          <td>{{ key }}</td>
          <td>{{ value }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      domainName: '',
      type: 'domain information',
      domainData: null,
      errorMessage: ''
    };
  },
  methods: {
    async fetchWhoisData() {
      try {
        this.errorMessage = '';
        const response = await axios.post('http://localhost:5000/whois', {
          domainName: this.domainName,
          type: this.type
        });
        this.domainData = response.data;
      } catch (error) {
        this.errorMessage = 'Failed to retrieve domain information.';
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input,
.form-group select,
.form-group button {
  padding: 10px;
  margin-right: 10px;
}
   
table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 60%;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}

.error {
  color: red;
}
</style>
