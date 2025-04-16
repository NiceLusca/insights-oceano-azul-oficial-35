
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { formatCurrency, formatPercentage } from "./formatters";

export const exportToPdf = (data: any, diagnostics: any, comparisonData: any) => {
  const doc = new jsPDF();
  
  // Use the new logo base64 - updated with the whale logo
  const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Jnjb0YvwY8hXbT1gm/+vrqVn65a5zd4e97Hdgn2THa4egTTL1gwmhXF40vgJiXMJq7/MZzm+1JKlLc0JZxnNB9NjaBnGg9+TUKTzdMZ1eVOJZnLGXpkH+lRWWKOoK9FqIWmGNYUlJFmFRWVmZXVlbWW9ZZ1ljuUB5YP/MgePu6S/S8+9b6e8V33fbufqp9XX9Z/3ND0kfoN9B3yPfH9g/PP/pgf3TVL5SJoNv9obPDb8J/wLicKJ0R/mOP3EJLUJuIp0aDD4o/ha8T24a/HXET3q8M0UoTMSaJJSpKalKWkNqVDqX+qf9qT2qb2qf6pf9RQ1DI0ETSJqkVpRlpJKVAqVmmlulK9qFGkhSS51PG0i7RL9JvotXTrtLvM2PTCjMmZUzJ3M+8x72e+YH7KwrJIZE3OWpN1j/Uit5R7nHuah5tXmLeI14rXlTebN8A7wjvG+65gtuB84RrhdOFp4VbhPuH70n8JCwpHCjnCRcKuQq6Qe0d3DrQJHxFyxH3FH4l6id8Sx5TEkiJJN4lX38t+Hv1+1Pvfzgg4I+OM7DPSz+g4o+eM/jOGzxg7Y/KMVV5JXiQvnneNd5PXxOviteA9503znvM+887zLvI+8b4KRAURQTRvL28vC8vhLQl2BLsCR4Fbwf9EvAQZ4+rFq8QbxJvE28Q7xHvEFyXwEgnJRskWyTbJdskOyS7JHskByUHJIclhyTeS75LnJT9JXkj+kLySvJaKpZGkuVRPWklaRVpDWldaT9pI2kzaSdomPS49ITktYZILkovMg1wsuSK5Krkm+TvNCeJCl9CX3CVsB+4JB4WjwgnhtnBX+Cy8LcxK6aSJdCedpZE0libSJI2ZjpK4V7hPeEA4LBwRjgsnhNPC98IF4aJwVbgm3BBuCbeDvFXBZeGqsE84JBwRjgvnhJ+Ez8KboBCUBXVAF7AHrAGbIDYYEAwJRgTjgvHAUGQ4MhoZj0xGxiOzgRnF0GAysAysCJYHG4PdwfHgZHAueCP4JihAlA3qgD6EcQgXGYiMRiYi85HFyEpkLbIR2YzsRvYih5GTyFnkYuRa5HrkduRB5GnkWeRF5FXkTeSfRFgik2RLFFK1VE/VSg1So9Sw1CSN0lHaKOPZPHhJDVH91Bg1SZ+mZ+kFepXepLfpA/qYPqfP6Sv6hn5MP6Vf0G/p9/Qn+jP9kv5A/6B/0b/ov+S9KJXakvYSl8QlvRK/pEJSJmmTrJNskeySLE5cRtfKUll5KV0tqywvl9eR15c3qqgsJ68qryGvLW8obyJvJm9eWJZfRl5eXkGeKW8kTxaVlzVi3C9vKE+WP0Bsl9/P8ZCH5XHuFDPNdI4ZYYaYC7wvzCRzhmllhCln5nJRZpYZZ0aYcT7qKDPETDLTzCwzz0wxi8wKs8ZsMJvMDrPHYPQhs8/sM/vMPrOP2B9jhpmRIhdFMW8RxRMuHtC3KKkohXm7KJFwkSFKLUojbFWUSLhIFJUWpRJ2x+cKF9eFi2JRcVFKUSpRieiCqJZwoSA4KaonXDwUPC9aQ7ioLSohXGiIrIUVhJWFtYS1hQ2ETYXNBH8KzxU2FzYTVhXWFNYS1hU2FDYS/CU8T9hY2FgYEbYQthK2EYYJG5YRVi1cWAmOFZYVlheWEZYSkiLBXaJ4UQJhlVzEIawgpITVhRzBzcIqwkpCXogJMWEFYQXBVnBYWEmUXJRKlESUTJRYlFaUXpRZlFGUQ5RLlF2UVZRHlFeUS5RXlFdURFRcVFxUQlRKVFpUUpRUlFyUQpRSlBKxz6JUotSidHAOlFGUUZRdlE6UVpRWlFaUSZRZlFuUXZRdlEOUR5RXlEeUS5RblEeUS5RPlB+P5YtKiEqJSolKikqLSopSidKI0opSi1KL0orSijKIMoiyirKJsojyiHKKcou45QKKuOU8otyivKICosKiIqKiopKicqLyokqiGqLaohqieqJGonaibqJeoo6iC0V9RH1F/UX9RX1FA0UDRJeQXl00QHSJaKDoMmIr0aWiq0TXim4QXSe6QXS76KFcJAeIJg3plqLJFcguFiPRFEEuZi6ORBMmUSXRdEA0cRHVFk16xHlF81hxDtEERDTtEdUUTXlEXEUTJ1F+0cRHVFo0RRKVEk2rxOk4SaBziibZork0ohwUTQPE+UXTQ1FJ0aRTVFQ0bRCnp6DX52KMolpYNP0QzQ/E+UVTEXFq0XxDnEg0hRA1FE1TxHlF8xBxAdGUSpxaNMUQTbBEhUUdRXMF0cRPVEc0JxRNlUTZRVNQUR7R3FFURjS1FM2RRBVEs+FQA9HkQ1RJNCsOTR1FLUX9RdM8cSPRnFc06xanFc1/RHNhcW3R1Fg0jxZnFM2BxalFs2rRfFrUR1RCNLcW5RTNL0UtRXM5cUrRLFc0xxXnFc1kRVNn0fQiWEw0kwjm5ziI5hHBRDxzxTMzPNxX0WwhWIxnJ3iugucgeP6B5x54noDnBngWgecGwZ6idgcHizqJi6Kp/98YxlCEUZRhDGMYxxgmMIZJjGEKY5jGGGYwhtnsYRzFHscwjmIcwzCOYRjHMI5hnMAYJjGGKYxhGmOYwRhmMRbL8VECcBKYFpgRmBWYE7BuJoF5ATuHRAosCCwKLAksCywLrAisC2wIbApoHnYYhAKbAlsCWwLbAjsGe4mBokDcwkRXcL/APsEBAsNEBwoMFRgmMFxghMAogbECEwUmCUwWmIJTqYJLBZcJLhdcKbhKcLXgGsG1gusENwhuFNwhuFtwn+ABwaOCxwVPCZ4VPCP4g+B5wcuCVwWvC94UvCto/XBnIBTcK7hP8IDgIcGjgscETwlOCk4JTgvOCM4KzgkuCC4JLguuCK4Lbgg+FNwr+EjwqeAzwReCr6QSqUyqkGqkeqlRapLapCFpRBqXJqRJqUwalealRekqaU1qkJqlNmmPtFc6IB2UDkuHpaPSMdEVmXRYOiIdl45Lx6ST0inptHRaOiOdlc5K56TzAvOCSwKLggsCCwJzAnMCswKzAjN4VjUnMCMwLTApMCkwITAuMCYwKjAiMCwwJDAoMCAwJNAvMCDQL9An0CvQK9Ar0CPQI9At0CXQJdAp0C7QJtAq0CzQJNAoUC9QJ1ArUCNQLVAlUCFQIVAuUCZQKpAnkCuQI5AtkCWQKZAhkCGQJpAqkEp53TQJpAokCyQJJAokCMQLxAnECsQIRAtoAtECUTxFjhCIEIgQCBcIF0gSCBdwCpwSOCkwJTApMC4wJjAiMCwwKDAg0C/QJ9AlcFKgXaBNoEWgSaBeoE6gVqBaoFKgQiBDIE0gVSBZIFEgQSBOQLXcWwE/AZ+At4C3gBgBHwGPQIhAsICPgLegQdAoaBLUCxoEDYIGQYOgUVAvqBPUCmoE1YI8QY4gW5ApyBCkC1IF6YJ0QYYgU5AlyBFkCXIFeYI8QZ4gV5AtyBZkCTIFGYIcQZYgQ5AuyBBkCzIFGYJ0QaYgS5AtiBGIFogUCBeIFPAJ+AuECIQI2O+tgHEQxl2/f0f0BgncQNsrMmLAMcEbBUcFxwT7BMcEpwQ7BNsFjwieENwvuENwTPCg4B7BAwJ3Cu4V3C14THCv4D7B/YIHBfcJHhTcK3hAcLfgLsGdgjsE9woOCE4IngpanLd+OLBB8IHgHsFdgjsFdwr2CfYL9gruFtwtuFfwoOA+wX2C+wQPCB4UPCK4S3C34D7B3YITgicEjwruETwkuFdwj+AhwSOCRwUPCe4TPCB4SPCY4F7B3YL7BPcLHhDcI7hbcK/gYcGjgscEjwoeEzwquFfwgOAhwcOCRwQPCR4WPCK4V3CP4D7B/YIHBXcL7hHc/x+jxzYgxhLECGEfxK6IbUJsA2JrEVuDWD1itYjVIFaFWCViZYgViRQjlodYLmIZiKUjlooYB7F4xGIQi0IsBLEwxLyIeRBzIeZAzI6YDTErYhbEzIiZEDMiJkJMgJgAMT5iKoh5ISZGjI8YDzEeYlzEOIixEWMhxkLMgxgXMSFiQsTcEHNBzIkxB2L23OyIbUBsHWKrEVuJ2ArEliO2DDEdLGYvS/BLaC9KXNTivsJFiYsWLva4KHCx14V2O4m7BLGViC1HbCliSxBbDA4sQmwRYgsRm4/YfMTmITYXsTmIzUZsFmKzEJuB2AzEpiPmRUyImAgxPmIcxNiIsRBjIsZAjI6YBjE1YkrEFLnbEbMjZkPMipgZMSNiBsSEiAkQ4yPGRUyEKt9f+P3CFwooFi18ufDVwieLLxQTLBCc/nNgzp8Dhz+Hbf7ZsCXXYVR1GDQddgK0sCxiqxBbidiKorLY/0dRR1H/3wG0sJei/orOFFUq6qmoTFFe0diiYUUjiwoV5SxKK0opyioKKQoqClDkr8inyFORa5FPkYciuyKrIoMijSKVIoUiuSKZIoki1e8IvJa/prwWvGa8JrymCm1TgLcKCvJW8JbyFvKWP0PY47wFvPnPJexR3jzeXN4c3mze7GcIe5g3kzeDN/0Zwh7iTecN4U3jDXmGsPt5/Xl9eb15XQldLWHY/rwuvE685A++neBFvP689rxOvJa8FrymvCa8xrwGvOQPvq3gReL14HXjdeA1IbRBgDfideK15TVLvxM+J95iXtLHMzYpvHZ4rXiN8Brw6vJa8mrw4j6esSntNeHV51XlVeHF4lXiVeSV58V9PGNT2avAK/txkE1B3mLeIl4cbuHj6ZqCvAW82byZvBnPELbwl49nbAryFvJiPp6xKcibxYv+eMamIK8/L/aTDJv8vGjMi+JF8CJ54b9vvH68UN7HQzYFef14vb9vPJ+8Hr9vfC9e99833k9e1983niOv5+8bz43X+feN153X6/eN153X+ffNL78H3ldet98330deH97f2/f9vOzHf4yULMeDJ/7nwE+IzHG/O8O4T1+Mv/lv/N8xXiPeE94L3lveB94H3mfeV9433g+e9/eFd4N3kXeOd5p3gheF31feCd5x3nHeSd5J3nHeMd4RXjQvkneId4B3gLePt5e3l7eHt5u3m7ebt4u3i7eDt523jbeFt5m3kbeRt563jreOt5a3mreKt5K3ghfEK0fhxPEO8w7xdvMCeXk8P14gL4OXxkvhJfESeHG8WF40L4oXyQvnhfICeMG8AF4gz5/nz/PnBfL8eYG8AJ4fz5fnw/Ph+fC8ed48L543z4vnxfPkufHcec48N54rz4XnxLPj2fFseda8U7wTvKO8Q7z9vL28vbxdvJ28Hbxtvg7fLt923g7eDr7ad8i307fbV/a782SgUuCZwFOBpwIzArMCcwLzAosCywLrAhsC2wJ7AgcCh/FUd0TgiMBRgQ8FbQKLA4sCCwIqgSWBdYENgc2BRwKPBZ4IPBV4LvBc4IXAS4E3Au8F/hR4J/Be4KPAnjAHZIGJMJGwUFgkLA4WDYuBRcOiYFGwCFg4LAwWCguBBcMCYIGwAJg/zA/mC/OF+cF8YT4wuHFPmDfMAwaDocB8YZ4wL5gnQfaDjvEgIsSVEi5+gQQ8Lb/R7x/QzH9Ayz+iHR35D2jDP6Dz/wGt+0d4G5qLmfwvTcPivgvL3eHCX+Kvf0u8lLylOLXy1uIl5sMN7CufC74WfPtbOk7pOLUTVE5QNUHl35Jx4oe3LgnnvE/jfRrvu2CckiQnNuct5a3EVuFuYkdxJ7GzuIPYSTzBH9nEcfCfgN9EPSQdaXeSsyPrSNkR4iMkDzm6jzw9uY+Y7sNHT26mHZv8F1hnRdm39JKRkMEhJXdIxh1SLHJ4AXnCqB/R7h/Rzh/R9h/R1n9AG/8Devo/oMf/Az7+D+g+kR/eZv+IsfxHjOkf0Zt/wLj/AWP/B5zjP+Ac/wHn+A8493/+D+O1yHhlUw==';
  
  // Adicionar logo
  doc.addImage(logoBase64, 'PNG', 15, 15, 30, 30);
  
  // Add title with logo
  doc.setTextColor(0, 51, 153);
  doc.setFontSize(22);
  doc.text("Diagnóstico de Funil de Vendas", 50, 25);
  
  doc.setTextColor(0, 102, 204);
  doc.setFontSize(16);
  doc.text("Oceano Azul", 50, 35);
  
  // Report date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  const today = format(new Date(), "dd/MM/yyyy");
  doc.text(`Relatório gerado em: ${today}`, 15, 50);
  
  // Analysis period (if available)
  if (data.startDate && data.endDate) {
    const startDate = format(new Date(data.startDate), "dd/MM/yyyy");
    const endDate = format(new Date(data.endDate), "dd/MM/yyyy");
    doc.text(`Período da análise: ${startDate} a ${endDate}`, 15, 55);
  }
  
  // Main metrics
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Métricas Principais", 15, 65);
  
  const metrics = [
    ["Faturamento Total", formatCurrency(diagnostics.totalRevenue)],
    ["Conversão da Página de Vendas", `${diagnostics.salesPageConversion.toFixed(1)}%`],
    ["Conversão do Checkout", `${diagnostics.checkoutConversion.toFixed(1)}%`],
    ["Conversão Final", `${diagnostics.finalConversion.toFixed(1)}%`],
    ["Taxa de Order Bump", `${diagnostics.orderBumpRate ? diagnostics.orderBumpRate.toFixed(1) : 0}%`],
  ];
  
  if (diagnostics.currentROI) {
    metrics.push(["ROI Atual", `${diagnostics.currentROI.toFixed(2)}x`]);
  }
  
  if (diagnostics.maxCPC) {
    metrics.push(["CPC Máximo Recomendado", formatCurrency(diagnostics.maxCPC)]);
  }
  
  if (diagnostics.currentCPC) {
    metrics.push(["CPC Atual", formatCurrency(diagnostics.currentCPC)]);
  }
  
  autoTable(doc, {
    startY: 70,
    head: [["Métrica", "Valor"]],
    body: metrics,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
  });
  
  // Diagnostics
  const tableHeight = (doc as any).lastAutoTable?.finalY || 130;
  doc.setFontSize(14);
  doc.text("Diagnóstico", 15, tableHeight + 10);
  
  const diagnosisRows = diagnostics.messages.map((msg: any) => [msg.message]);
  
  autoTable(doc, {
    startY: tableHeight + 15,
    head: [["Insights e Recomendações"]],
    body: diagnosisRows,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
  });
  
  // Comparison with ideal metrics
  const comparisonStartY = (doc as any).lastAutoTable?.finalY || 200;
  doc.setFontSize(14);
  doc.text("Comparação com Métricas Ideais", 15, comparisonStartY + 10);
  
  const comparisonRows = comparisonData.map((item: any) => [
    item.name, 
    `${item.actual}%`, 
    `${item.ideal}%`
  ]);
  
  autoTable(doc, {
    startY: comparisonStartY + 15,
    head: [["Métrica", "Seu Valor", "Valor Ideal"]],
    body: comparisonRows,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(100, 100, 100);
    
    // Adicionar logo pequeno no rodapé
    doc.addImage(logoBase64, 'PNG', 10, doc.internal.pageSize.height - 18, 10, 10);
    
    doc.text(
      "© Oceano Azul - Otimização constante é o caminho.",
      25,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  doc.save("diagnostico-funil-vendas-oceano-azul.pdf");
  
  return true;
};
