const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttons = Array.from(document.querySelectorAll(".btn"));
let expression = "";
function updateDisplay(){
  expressionEl.textContent = expression || "0";
  const computed = computeSafe(expression);
  resultEl.textContent = computed === null ? "0" : computed;
}
function computeSafe(expr){
  if(!expr) return null;
  const prepared = expr.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-").replace(/%/g,"/100");
  if(/[^0-9+\-*/().% ]/.test(prepared)) return null;
  try{
    const value = Function('"use strict";return ('+prepared+')')();
    if(value===Infinity || value===-Infinity || Number.isNaN(value)) return null;
    if(typeof value === "number"){
      return Number.isFinite(value) ? Math.round(value*1e12)/1e12 : null;
    }
    return null;
  }catch(e){
    return null;
  }
}
function appendValue(val){
  if(val==="." && /\.\d*$/.test(expression)) return;
  if(["+","-","×","÷"].includes(val)){
    if(expression==="" && val!="-") return;
    if(/[+\-×÷]$/.test(expression)) expression = expression.slice(0,-1);
  }
  expression += val;
  updateDisplay();
}
function clearAll(){
  expression = "";
  updateDisplay();
}
function deleteLast(){
  expression = expression.slice(0,-1);
  updateDisplay();
}
function evaluateExpression(){
  const res = computeSafe(expression);
  if(res===null) return;
  expression = String(res).replace("-", "−");
  updateDisplay();
}
buttons.forEach(btn=>{
  const v = btn.dataset.value;
  const action = btn.dataset.action;
  btn.addEventListener("click",()=>{
    if(action==="clear") clearAll();
    else if(action==="del") deleteLast();
    else if(action==="evaluate") evaluateExpression();
    else if(action==="percent"){
      expression += "%";
      updateDisplay();
    }else if(v){
      appendValue(v);
    }
  });
});
window.addEventListener("keydown",(e)=>{
  if(e.key >= "0" && e.key <= "9") appendValue(e.key);
  else if(e.key === ".") appendValue(".");
  else if(e.key === "Enter" || e.key === "="){
    e.preventDefault();
    evaluateExpression();
  }else if(e.key === "Backspace") deleteLast();
  else if(e.key === "Escape") clearAll();
  else if(e.key === "+" ) appendValue("+");
  else if(e.key === "-" ) appendValue("−");
  else if(e.key === "*" ) appendValue("×");
  else if(e.key === "/" ) appendValue("÷");
});
updateDisplay();
