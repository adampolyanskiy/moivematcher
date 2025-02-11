using System;

namespace EyeRide.FMS.Model.Infrastructure.Exceptions;

/// <summary>
/// Represents the base exception for all domain-related errors in the service layer.
/// This exception is abstract and should not be thrown directly.
/// </summary>
public abstract class DomainException : Exception
{
    protected DomainException(string message)
        : base(message)
    {
    }

    protected DomainException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}