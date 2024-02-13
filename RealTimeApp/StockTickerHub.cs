using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
public class StockTickerHub : Hub
{
    public StockTickerHub()
    {
    }

    public async Task Subscribe(string symbol)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, symbol);
        // Simulate fetching the current price for the symbol and send it back
        await Clients.Caller.SendAsync("ReceiveUpdate", symbol, GetPrice(symbol));
    }

    public async Task Unsubscribe(string symbol)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, symbol);
    }

    public Task SendUpdate(string symbol, decimal price)
    {
        return Clients.Group(symbol).SendAsync("ReceiveUpdate", symbol, price);
    }

    private decimal GetPrice(string symbol)
    {
        // Placeholder for getting the initial price of a symbol
        Random rand = new Random();
        int randomNumber = rand.Next(0, 101); // Generates a random number between 0 and 100, inclusive.

        return new decimal(randomNumber); // Simulate an initial price
    }
}
