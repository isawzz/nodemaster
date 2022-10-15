


function eval_approx_integral(f,xfrom,xto,dx){}
function eval_approx_derivative(f,xfrom,xto,dx){}
function eval_normal_cdf(x,mean,stdev){let f=get_normal_cdf(mean,stdev);return f(x);}
function eval_normal_pdf(x,mean,stdev){let f=get_normal_pdf(mean,stdev);return f(x);}

function get_approx_integral(f,dx){}
function get_approx_derivative(f,dx){}
function get_normal_cdf(mean,stdev){}
function get_normal_pdf(mean,stdev){}

function plot_function(canvas,f,xfrom,xto,styles={}){}
function plot_line(canvas,x1,y1,x2,y2,styles={}){}
function plot_point(canvas,x,y,styles={}){}

function plot_pdf(canvas,mean,stdev,xfrom,xto,styles={}){}
function plot_cdf(canvas,mean,stdev,xfrom,xto,styles={}){}
function plot_integral(canvas,f,xfrom,xto,styles={}){}
function plot_derivative(canvas,f,xfrom,xto,styles={}){}

function format_latex(exp){}
























