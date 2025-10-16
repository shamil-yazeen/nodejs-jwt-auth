const employeesDb = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};
// const path = require("path");
// const fs = require("fs/promises");

const getAllEmployees = (req, res) => {
  res.json(employeesDb.employees);
};

const createNewEmployee = (req, res) => {
  if (!req.body.firstName || !req.body.lastName)
    return res
      .status(400)
      .json({ message: "First and Last Names are required" });

  const newEmployee = {
    id: employeesDb.employees[employeesDb.employees.length-1].id + 1 || 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  employeesDb.setEmployees([...employeesDb.employees, newEmployee]);
  res.status(201).json(employeesDb.employees);
};

const updateEmployee = (req, res) => {
    console.log(typeof(parseInt(req.body.id)))
    
    const employee = employeesDb.employees.find(emp=>emp.id === parseInt(req.body.id))
    if(!employee) return res.status(400).json({'message' : 'employee not found'})

    if(req.body.firstName) employee.firstName = req.body.firstName
    if(req.body.lastName) employee.lastName = req.body.lastName
    
    const filteredArray = employeesDb.employees.filter(emp=>emp.id !== parseInt(req.body.id))
    const unsortedArray = [...filteredArray,employee]
    const sortedArray = unsortedArray.sort((a,b)=> a.id > b.id ? 1 : a.id < b.id ? -1 : 0)

    employeesDb.setEmployees(sortedArray)
    res.status(201).json(employeesDb.employees)
};


const deleteEmployee = (req, res) => {
    const employee = employeesDb.employees.find(emp=>emp.id === parseInt(req.body.id))
    if(!employee) return res.status(400).json({'message' : `employee id ${req.body.id} not found`})
    
    const filteredArray = employeesDb.employees.filter(emp=>emp.id !== parseInt(req.body.id))
    employeesDb.setEmployees(filteredArray.sort((a,b)=> a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    res.status(201).json(employeesDb.employees)
};

const getEmployee = (req, res) => {
    const employee = employeesDb.employees.find(emp=>emp.id === parseInt(req.params.id))
    if(!employee) return res.status(400).json({'message' : `employee id ${req.params.id} not found`})
    
    res.status(201).json(employee)
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
