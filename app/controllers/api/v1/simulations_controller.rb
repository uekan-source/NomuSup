module Api
  module V1
    class SimulationsController < ApplicationController
      def calculate
        weight = params[:weight].to_f
        gender = params[:gender].presence || 'male'
        constitution = params[:constitution].presence || 'normal'
        drinks = params[:drinks] || []

        service = AlcoholSimulationService.new(
          weight: weight,
          gender: gender,
          constitution: constitution,
          drinks: drinks
        )

        result = service.execute

        render json: {
          status: 'success',
          data: result
        }, status: :ok
      end
    end
  end
end
