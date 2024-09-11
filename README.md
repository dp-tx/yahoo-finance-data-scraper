# yahoo-finance-data-scraper
Portable vanilla JavaScript code that can scrape and download historical stock data from the Yahoo Finance website.

Minified JS code:

```
function W(){for(a=document.getElementsByTagName("a"),b=null,i=0;i<a.length;i++)if("Download"==a[i].innerText){b=a[i];break}if(null==b)throw alert("The script was not able to locate the HTML link element for the download button."),new Error;return b}function X(){c=null,f=document.querySelectorAll("table");for(let t=0;t<f.length;t++)if(e=f[t],d=e.querySelectorAll("thead tr th"),"Date"==d[0].innerText&&"Open"==d[1].innerText&&"High"==d[2].innerText){c=e;break}if(null==c)throw alert("The script was not able to locate the HTML table element that contains the financial data."),new Error;return c}function Z(){g=null,h=null,l=document.getElementsByClassName("tertiary-btn fin-size-small");for(let e=0;e<l.length;e++)k=l[e],k.innerText.includes("-")&&["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].includes(k.innerText.substr(0,3))&&(g=k),["Daily","Weekly","Monthly"].includes(k.innerText)&&(h=k);if(null==g||null==h)throw alert("The script was not able to locate the HTML button elements that contain the dates and frequency."),new Error;return[g,h]}function Y(){m=null,o=document.getElementsByTagName("h1");for(let e=0;e<o.length;e++)if(n=o[e],"section"==n.parentElement.tagName.toLowerCase()){m=n;break}if(null==m)throw alert("The script was not able to locate the HTML label with the name and ticker symbol"),new Error;return m}function R(){let e=Z();q=e[0],r=e[1],s=X(),v=Y(),u="",s.querySelectorAll("thead tr th").forEach((e=>{u+=e.innerText.trim()+","})),u=u.substr(0,u.length-1)+"\n",y=s.querySelectorAll("tbody tr");for(let e=0;e<y.length;e++)a="",y[e].querySelectorAll("td").forEach((e=>{a+=e.innerText.trim().replaceAll(",","")+","})),z=a.split(" "),a=z[1]+"-"+z[0]+"-"+z.slice(2,z.length).join(""),a=a.substr(0,a.length-1)+"\n",u+=a;return w=v.innerText.trim(),x=w+" "+r.innerText+" "+q.innerText+".csv",[x,u]}Q=W(),Q.children.length>=1&&Q.children[0].remove(),Q.href="#",Q.addEventListener("click",(function(){T=R();const e=T[1],t=new Blob([e],{type:"text/plain"}),n=document.createElement("a"),l=URL.createObjectURL(t);n.href=l,n.download=T[0],n.click(),n.remove()}));
```

## Description

Yahoo Finance now requires you to pay almost $500 a year to download the same historical financial data that you used to be able to download free of charge.
This script allows you to download the data for free once again.

## Usage
1. Open Yahoo Finance to the page containing the historical data for your desired stock or index. For example, the S&P 500 index: https://finance.yahoo.com/quote/%5EGSPC/history/
2. Open your browser's web inspector. This can be done by either right clicking anywhere on the page and selecting "Inspect" from the menu, or using the shortcut key, which is usually F12 or Ctrl+Shift+C on PC. Mac Safari I have no idea.
3. Go to the "Console" tab in the inspector
4. Copy the minified JS code from the code block above and paste it into the console line entry.
5. Press enter.
6. If it worked, you should see that the lock icon that used to be next to the "Download" button is now gone.
7. Close the inspector tool.
8. Choose your date range and frequency on Yahoo Finance using the buttons at the top.
9. Wait for the table to fully load.
10. Click "Download" at the top right and the CSV file containing all of the data in the table should begin downloading to your computer automatically.

## Imporant Note!
If you refresh the page or close the tab or your browser, you will have to repeat steps 2-10 again when you revisit Yahoo Finance. 
Also, if you change to another ticker symbol and go to its historical data, you will have to repeat steps 2-10 again as well.
This code only works as long as you stay on the exact same page (URL) and don't refresh it.
